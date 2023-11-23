/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const lazy = {};

ChromeUtils.defineESModuleGetters(lazy, {
  assert: "chrome://remote/content/shared/webdriver/Assert.sys.mjs",
  error: "chrome://remote/content/shared/webdriver/Errors.sys.mjs",
  truncate: "chrome://remote/content/shared/Format.sys.mjs",
});

/** Representation of the packets transproted over the wire. */
export class Message {
  /**
   * @param {number} messageID
   *     Message ID unique identifying this message.
   */
  constructor(messageID) {
    this.id = lazy.assert.integer(messageID);
  }

  toString() {
    function replacer(key, value) {
      if (typeof value === "string") {
        return lazy.truncate`${value}`;
      }
      return value;
    }

    return JSON.stringify(this.toPacket(), replacer);
  }

  /**
   * Converts a data packet into a {@link Command} or {@link Response}.
   *
   * @param {Array.<number, number, ?, ?>} data
   *     A four element array where the elements, in sequence, signifies
   *     message type, message ID, method name or error, and parameters
   *     or result.
   *
   * @returns {Message}
   *     Based on the message type, a {@link Command} or {@link Response}
   *     instance.
   *
   * @throws {TypeError}
   *     If the message type is not recognised.
   */
  static fromPacket(data) {
    const [type] = data;

    switch (type) {
      case Command.Type:
        return Command.fromPacket(data);

      case Response.Type:
        return Response.fromPacket(data);

      default:
        throw new TypeError(
          "Unrecognised message type in packet: " + JSON.stringify(data)
        );
    }
  }
}

/**
 * Messages may originate from either the server or the client.
 * Because the remote protocol is full duplex, both endpoints may be
 * the origin of both commands and responses.
 *
 * @enum
 * @see {@link Message}
 */
Message.Origin = {
  /** Indicates that the message originates from the client. */
  Client: 0,
  /** Indicates that the message originates from the server. */
  Server: 1,
};

/**
 * A command is a request from the client to run a series of remote end
 * steps and return a fitting response.
 *
 * The command can be synthesised from the message passed over the
 * Marionette socket using the {@link fromPacket} function.  The format of
 * a message is:
 *
 * <pre>
 *     [<var>type</var>, <var>id</var>, <var>name</var>, <var>params</var>]
 * </pre>
 *
 * where
 *
 * <dl>
 *   <dt><var>type</var> (integer)
 *   <dd>
 *     Must be zero (integer).  Zero means that this message is
 *     a command.
 *
 *   <dt><var>id</var> (integer)
 *   <dd>
 *     Integer used as a sequence number.  The server replies with
 *     the same ID for the response.
 *
 *   <dt><var>name</var> (string)
 *   <dd>
 *     String representing the command name with an associated set
 *     of remote end steps.
 *
 *   <dt><var>params</var> (JSON Object or null)
 *   <dd>
 *     Object of command function arguments.  The keys of this object
 *     must be strings, but the values can be arbitrary values.
 * </dl>
 *
 * A command has an associated message <var>id</var> that prevents
 * the dispatcher from sending responses in the wrong order.
 *
 * The command may also have optional error- and result handlers that
 * are called when the client returns with a response.  These are
 * <code>function onerror({Object})</code>,
 * <code>function onresult({Object})</code>, and
 * <code>function onresult({Response})</code>:
 *
 * @param {number} messageID
 *     Message ID unique identifying this message.
 * @param {string} name
 *     Command name.
 * @param {Object<string, ?>} params
 *     Command parameters.
 */
export class Command extends Message {
  constructor(messageID, name, params = {}) {
    super(messageID);

    this.name = lazy.assert.string(name);
    this.parameters = lazy.assert.object(params);

    this.onerror = null;
    this.onresult = null;

    this.origin = Message.Origin.Client;
    this.sent = false;
  }

  /**
   * Calls the error- or result handler associated with this command.
   * This function can be replaced with a custom response handler.
   *
   * @param {Response} resp
   *     The response to pass on to the result or error to the
   *     <code>onerror</code> or <code>onresult</code> handlers to.
   */
  onresponse(resp) {
    if (this.onerror && resp.error) {
      this.onerror(resp.error);
    } else if (this.onresult && resp.body) {
      this.onresult(resp.body);
    }
  }

  /**
   * Encodes the command to a packet.
   *
   * @returns {Array}
   *     Packet.
   */
  toPacket() {
    return [Command.Type, this.id, this.name, this.parameters];
  }

  /**
   * Converts a data packet into {@link Command}.
   *
   * @param {Array.<number, number, *, *>} payload
   *     A four element array where the elements, in sequence, signifies
   *     message type, message ID, command name, and parameters.
   *
   * @returns {Command}
   *     Representation of packet.
   *
   * @throws {TypeError}
   *     If the message type is not recognised.
   */
  static fromPacket(payload) {
    let [type, msgID, name, params] = payload;
    lazy.assert.that(n => n === Command.Type)(type);

    // if parameters are given but null, treat them as undefined
    if (params === null) {
      params = undefined;
    }

    return new Command(msgID, name, params);
  }
}

Command.Type = 0;

/**
 * @callback ResponseCallback
 *
 * @param {Response} resp
 *     Response to handle.
 */

/**
 * Represents the response returned from the remote end after execution
 * of its corresponding command.
 *
 * The response is a mutable object passed to each command for
 * modification through the available setters.  To send data in a response,
 * you modify the body property on the response.  The body property can
 * also be replaced completely.
 *
 * The response is sent implicitly by
 * {@link server.TCPConnection#execute when a command has finished
 * executing, and any modifications made subsequent to that will have
 * no effect.
 *
 * @param {number} messageID
 *     Message ID tied to the corresponding command request this is
 *     a response for.
 * @param {ResponseHandler} respHandler
 *     Function callback called on sending the response.
 */
export class Response extends Message {
  constructor(messageID, respHandler = () => {}) {
    super(messageID);

    this.respHandler_ = lazy.assert.callable(respHandler);

    this.error = null;
    this.body = { value: null };

    this.origin = Message.Origin.Server;
    this.sent = false;
  }

  /**
   * Sends response conditionally, given a predicate.
   *
   * @param {function(Response): boolean} predicate
   *     A predicate taking a Response object and returning a boolean.
   */
  sendConditionally(predicate) {
    if (predicate(this)) {
      this.send();
    }
  }

  /**
   * Sends response using the response handler provided on
   * construction.
   *
   * @throws {RangeError}
   *     If the response has already been sent.
   */
  send() {
    if (this.sent) {
      throw new RangeError("Response has already been sent: " + this);
    }
    this.respHandler_(this);
    this.sent = true;
  }

  /**
   * Send error to client.
   *
   * Turns the response into an error response, clears any previously
   * set body data, and sends it using the response handler provided
   * on construction.
   *
   * @param {Error} err
   *     The Error instance to send.
   *
   * @throws {Error}
   *     If <var>err</var> is not a {@link WebDriverError}, the error
   *     is propagated, i.e. rethrown.
   */
  sendError(err) {
    this.error = lazy.error.wrap(err).toJSON();
    this.body = null;
    this.send();

    // propagate errors which are implementation problems
    if (!lazy.error.isWebDriverError(err)) {
      throw err;
    }
  }

  /**
   * Encodes the response to a packet.
   *
   * @returns {Array}
   *     Packet.
   */
  toPacket() {
    return [Response.Type, this.id, this.error, this.body];
  }

  /**
   * Converts a data packet into {@link Response}.
   *
   * @param {Array.<number, number, ?, ?>} payload
   *     A four element array where the elements, in sequence, signifies
   *     message type, message ID, error, and result.
   *
   * @returns {Response}
   *     Representation of packet.
   *
   * @throws {TypeError}
   *     If the message type is not recognised.
   */
  static fromPacket(payload) {
    let [type, msgID, err, body] = payload;
    lazy.assert.that(n => n === Response.Type)(type);

    let resp = new Response(msgID);
    resp.error = lazy.assert.string(err);

    resp.body = body;
    return resp;
  }
}

Response.Type = 1;
