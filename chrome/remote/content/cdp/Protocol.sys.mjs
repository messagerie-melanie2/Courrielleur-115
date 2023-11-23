/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// The `Description` below is imported from Chromium Code.

// TODO(ato): We send back a description of the protocol
// when the user makes the initial HTTP request,
// but the following is pure fiction.
const Description = {
    "domains": [
        {
            "domain": "Accessibility",
            "experimental": true,
            "dependencies": [
                "DOM"
            ],
            "types": [
                {
                    "id": "AXNodeId",
                    "description": "Unique accessibility node identifier.",
                    "type": "string"
                },
                {
                    "id": "AXValueType",
                    "description": "Enum of possible property types.",
                    "type": "string",
                    "enum": [
                        "boolean",
                        "tristate",
                        "booleanOrUndefined",
                        "idref",
                        "idrefList",
                        "integer",
                        "node",
                        "nodeList",
                        "number",
                        "string",
                        "computedString",
                        "token",
                        "tokenList",
                        "domRelation",
                        "role",
                        "internalRole",
                        "valueUndefined"
                    ]
                },
                {
                    "id": "AXValueSourceType",
                    "description": "Enum of possible property sources.",
                    "type": "string",
                    "enum": [
                        "attribute",
                        "implicit",
                        "style",
                        "contents",
                        "placeholder",
                        "relatedElement"
                    ]
                },
                {
                    "id": "AXValueNativeSourceType",
                    "description": "Enum of possible native property sources (as a subtype of a particular AXValueSourceType).",
                    "type": "string",
                    "enum": [
                        "figcaption",
                        "label",
                        "labelfor",
                        "labelwrapped",
                        "legend",
                        "tablecaption",
                        "title",
                        "other"
                    ]
                },
                {
                    "id": "AXValueSource",
                    "description": "A single source for a computed AX property.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "type",
                            "description": "What type of source this is.",
                            "$ref": "AXValueSourceType"
                        },
                        {
                            "name": "value",
                            "description": "The value of this property source.",
                            "optional": true,
                            "$ref": "AXValue"
                        },
                        {
                            "name": "attribute",
                            "description": "The name of the relevant attribute, if any.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "attributeValue",
                            "description": "The value of the relevant attribute, if any.",
                            "optional": true,
                            "$ref": "AXValue"
                        },
                        {
                            "name": "superseded",
                            "description": "Whether this source is superseded by a higher priority source.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "nativeSource",
                            "description": "The native markup source for this value, e.g. a <label> element.",
                            "optional": true,
                            "$ref": "AXValueNativeSourceType"
                        },
                        {
                            "name": "nativeSourceValue",
                            "description": "The value, such as a node or node list, of the native source.",
                            "optional": true,
                            "$ref": "AXValue"
                        },
                        {
                            "name": "invalid",
                            "description": "Whether the value for this property is invalid.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "invalidReason",
                            "description": "Reason for the value being invalid, if it is.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "AXRelatedNode",
                    "type": "object",
                    "properties": [
                        {
                            "name": "backendDOMNodeId",
                            "description": "The BackendNodeId of the related DOM node.",
                            "$ref": "DOM.BackendNodeId"
                        },
                        {
                            "name": "idref",
                            "description": "The IDRef value provided, if any.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "text",
                            "description": "The text alternative of this node in the current context.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "AXProperty",
                    "type": "object",
                    "properties": [
                        {
                            "name": "name",
                            "description": "The name of this property.",
                            "$ref": "AXPropertyName"
                        },
                        {
                            "name": "value",
                            "description": "The value of this property.",
                            "$ref": "AXValue"
                        }
                    ]
                },
                {
                    "id": "AXValue",
                    "description": "A single computed AX property.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "type",
                            "description": "The type of this value.",
                            "$ref": "AXValueType"
                        },
                        {
                            "name": "value",
                            "description": "The computed value of this property.",
                            "optional": true,
                            "type": "any"
                        },
                        {
                            "name": "relatedNodes",
                            "description": "One or more related nodes, if applicable.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "AXRelatedNode"
                            }
                        },
                        {
                            "name": "sources",
                            "description": "The sources which contributed to the computation of this property.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "AXValueSource"
                            }
                        }
                    ]
                },
                {
                    "id": "AXPropertyName",
                    "description": "Values of AXProperty name: from 'busy' to 'roledescription' - states which apply to every AX\nnode, from 'live' to 'root' - attributes which apply to nodes in live regions, from\n'autocomplete' to 'valuetext' - attributes which apply to widgets, from 'checked' to 'selected'\n- states which apply to widgets, from 'activedescendant' to 'owns' - relationships between\nelements other than parent/child/sibling.",
                    "type": "string",
                    "enum": [
                        "busy",
                        "disabled",
                        "editable",
                        "focusable",
                        "focused",
                        "hidden",
                        "hiddenRoot",
                        "invalid",
                        "keyshortcuts",
                        "settable",
                        "roledescription",
                        "live",
                        "atomic",
                        "relevant",
                        "root",
                        "autocomplete",
                        "hasPopup",
                        "level",
                        "multiselectable",
                        "orientation",
                        "multiline",
                        "readonly",
                        "required",
                        "valuemin",
                        "valuemax",
                        "valuetext",
                        "checked",
                        "expanded",
                        "modal",
                        "pressed",
                        "selected",
                        "activedescendant",
                        "controls",
                        "describedby",
                        "details",
                        "errormessage",
                        "flowto",
                        "labelledby",
                        "owns"
                    ]
                },
                {
                    "id": "AXNode",
                    "description": "A node in the accessibility tree.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "nodeId",
                            "description": "Unique identifier for this node.",
                            "$ref": "AXNodeId"
                        },
                        {
                            "name": "ignored",
                            "description": "Whether this node is ignored for accessibility",
                            "type": "boolean"
                        },
                        {
                            "name": "ignoredReasons",
                            "description": "Collection of reasons why this node is hidden.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "AXProperty"
                            }
                        },
                        {
                            "name": "role",
                            "description": "This `Node`'s role, whether explicit or implicit.",
                            "optional": true,
                            "$ref": "AXValue"
                        },
                        {
                            "name": "name",
                            "description": "The accessible name for this `Node`.",
                            "optional": true,
                            "$ref": "AXValue"
                        },
                        {
                            "name": "description",
                            "description": "The accessible description for this `Node`.",
                            "optional": true,
                            "$ref": "AXValue"
                        },
                        {
                            "name": "value",
                            "description": "The value for this `Node`.",
                            "optional": true,
                            "$ref": "AXValue"
                        },
                        {
                            "name": "properties",
                            "description": "All other properties",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "AXProperty"
                            }
                        },
                        {
                            "name": "childIds",
                            "description": "IDs for each of this node's child nodes.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "AXNodeId"
                            }
                        },
                        {
                            "name": "backendDOMNodeId",
                            "description": "The backend ID for the associated DOM node, if any.",
                            "optional": true,
                            "$ref": "DOM.BackendNodeId"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "disable",
                    "description": "Disables the accessibility domain."
                },
                {
                    "name": "enable",
                    "description": "Enables the accessibility domain which causes `AXNodeId`s to remain consistent between method calls.\nThis turns on accessibility for the page, which can impact performance until accessibility is disabled."
                },
                {
                    "name": "getPartialAXTree",
                    "description": "Fetches the accessibility node and partial accessibility tree for this DOM node, if it exists.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Identifier of the node to get the partial accessibility tree for.",
                            "optional": true,
                            "$ref": "DOM.NodeId"
                        },
                        {
                            "name": "backendNodeId",
                            "description": "Identifier of the backend node to get the partial accessibility tree for.",
                            "optional": true,
                            "$ref": "DOM.BackendNodeId"
                        },
                        {
                            "name": "objectId",
                            "description": "JavaScript object id of the node wrapper to get the partial accessibility tree for.",
                            "optional": true,
                            "$ref": "Runtime.RemoteObjectId"
                        },
                        {
                            "name": "fetchRelatives",
                            "description": "Whether to fetch this nodes ancestors, siblings and children. Defaults to true.",
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "nodes",
                            "description": "The `Accessibility.AXNode` for this DOM node, if it exists, plus its ancestors, siblings and\nchildren, if requested.",
                            "type": "array",
                            "items": {
                                "$ref": "AXNode"
                            }
                        }
                    ]
                },
                {
                    "name": "getFullAXTree",
                    "description": "Fetches the entire accessibility tree",
                    "experimental": true,
                    "returns": [
                        {
                            "name": "nodes",
                            "type": "array",
                            "items": {
                                "$ref": "AXNode"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Animation",
            "experimental": true,
            "dependencies": [
                "Runtime",
                "DOM"
            ],
            "types": [
                {
                    "id": "Animation",
                    "description": "Animation instance.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "id",
                            "description": "`Animation`'s id.",
                            "type": "string"
                        },
                        {
                            "name": "name",
                            "description": "`Animation`'s name.",
                            "type": "string"
                        },
                        {
                            "name": "pausedState",
                            "description": "`Animation`'s internal paused state.",
                            "type": "boolean"
                        },
                        {
                            "name": "playState",
                            "description": "`Animation`'s play state.",
                            "type": "string"
                        },
                        {
                            "name": "playbackRate",
                            "description": "`Animation`'s playback rate.",
                            "type": "number"
                        },
                        {
                            "name": "startTime",
                            "description": "`Animation`'s start time.",
                            "type": "number"
                        },
                        {
                            "name": "currentTime",
                            "description": "`Animation`'s current time.",
                            "type": "number"
                        },
                        {
                            "name": "type",
                            "description": "Animation type of `Animation`.",
                            "type": "string",
                            "enum": [
                                "CSSTransition",
                                "CSSAnimation",
                                "WebAnimation"
                            ]
                        },
                        {
                            "name": "source",
                            "description": "`Animation`'s source animation node.",
                            "optional": true,
                            "$ref": "AnimationEffect"
                        },
                        {
                            "name": "cssId",
                            "description": "A unique ID for `Animation` representing the sources that triggered this CSS\nanimation/transition.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "AnimationEffect",
                    "description": "AnimationEffect instance",
                    "type": "object",
                    "properties": [
                        {
                            "name": "delay",
                            "description": "`AnimationEffect`'s delay.",
                            "type": "number"
                        },
                        {
                            "name": "endDelay",
                            "description": "`AnimationEffect`'s end delay.",
                            "type": "number"
                        },
                        {
                            "name": "iterationStart",
                            "description": "`AnimationEffect`'s iteration start.",
                            "type": "number"
                        },
                        {
                            "name": "iterations",
                            "description": "`AnimationEffect`'s iterations.",
                            "type": "number"
                        },
                        {
                            "name": "duration",
                            "description": "`AnimationEffect`'s iteration duration.",
                            "type": "number"
                        },
                        {
                            "name": "direction",
                            "description": "`AnimationEffect`'s playback direction.",
                            "type": "string"
                        },
                        {
                            "name": "fill",
                            "description": "`AnimationEffect`'s fill mode.",
                            "type": "string"
                        },
                        {
                            "name": "backendNodeId",
                            "description": "`AnimationEffect`'s target node.",
                            "optional": true,
                            "$ref": "DOM.BackendNodeId"
                        },
                        {
                            "name": "keyframesRule",
                            "description": "`AnimationEffect`'s keyframes.",
                            "optional": true,
                            "$ref": "KeyframesRule"
                        },
                        {
                            "name": "easing",
                            "description": "`AnimationEffect`'s timing function.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "KeyframesRule",
                    "description": "Keyframes Rule",
                    "type": "object",
                    "properties": [
                        {
                            "name": "name",
                            "description": "CSS keyframed animation's name.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "keyframes",
                            "description": "List of animation keyframes.",
                            "type": "array",
                            "items": {
                                "$ref": "KeyframeStyle"
                            }
                        }
                    ]
                },
                {
                    "id": "KeyframeStyle",
                    "description": "Keyframe Style",
                    "type": "object",
                    "properties": [
                        {
                            "name": "offset",
                            "description": "Keyframe's time offset.",
                            "type": "string"
                        },
                        {
                            "name": "easing",
                            "description": "`AnimationEffect`'s timing function.",
                            "type": "string"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "disable",
                    "description": "Disables animation domain notifications."
                },
                {
                    "name": "enable",
                    "description": "Enables animation domain notifications."
                },
                {
                    "name": "getCurrentTime",
                    "description": "Returns the current time of the an animation.",
                    "parameters": [
                        {
                            "name": "id",
                            "description": "Id of animation.",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "currentTime",
                            "description": "Current time of the page.",
                            "type": "number"
                        }
                    ]
                },
                {
                    "name": "getPlaybackRate",
                    "description": "Gets the playback rate of the document timeline.",
                    "returns": [
                        {
                            "name": "playbackRate",
                            "description": "Playback rate for animations on page.",
                            "type": "number"
                        }
                    ]
                },
                {
                    "name": "releaseAnimations",
                    "description": "Releases a set of animations to no longer be manipulated.",
                    "parameters": [
                        {
                            "name": "animations",
                            "description": "List of animation ids to seek.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                },
                {
                    "name": "resolveAnimation",
                    "description": "Gets the remote object of the Animation.",
                    "parameters": [
                        {
                            "name": "animationId",
                            "description": "Animation id.",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "remoteObject",
                            "description": "Corresponding remote object.",
                            "$ref": "Runtime.RemoteObject"
                        }
                    ]
                },
                {
                    "name": "seekAnimations",
                    "description": "Seek a set of animations to a particular time within each animation.",
                    "parameters": [
                        {
                            "name": "animations",
                            "description": "List of animation ids to seek.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "currentTime",
                            "description": "Set the current time of each animation.",
                            "type": "number"
                        }
                    ]
                },
                {
                    "name": "setPaused",
                    "description": "Sets the paused state of a set of animations.",
                    "parameters": [
                        {
                            "name": "animations",
                            "description": "Animations to set the pause state of.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "paused",
                            "description": "Paused state to set to.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setPlaybackRate",
                    "description": "Sets the playback rate of the document timeline.",
                    "parameters": [
                        {
                            "name": "playbackRate",
                            "description": "Playback rate for animations on page",
                            "type": "number"
                        }
                    ]
                },
                {
                    "name": "setTiming",
                    "description": "Sets the timing of an animation node.",
                    "parameters": [
                        {
                            "name": "animationId",
                            "description": "Animation id.",
                            "type": "string"
                        },
                        {
                            "name": "duration",
                            "description": "Duration of the animation.",
                            "type": "number"
                        },
                        {
                            "name": "delay",
                            "description": "Delay of the animation.",
                            "type": "number"
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "animationCanceled",
                    "description": "Event for when an animation has been cancelled.",
                    "parameters": [
                        {
                            "name": "id",
                            "description": "Id of the animation that was cancelled.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "animationCreated",
                    "description": "Event for each animation that has been created.",
                    "parameters": [
                        {
                            "name": "id",
                            "description": "Id of the animation that was created.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "animationStarted",
                    "description": "Event for animation that has been started.",
                    "parameters": [
                        {
                            "name": "animation",
                            "description": "Animation that was started.",
                            "$ref": "Animation"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "ApplicationCache",
            "experimental": true,
            "types": [
                {
                    "id": "ApplicationCacheResource",
                    "description": "Detailed application cache resource information.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "url",
                            "description": "Resource url.",
                            "type": "string"
                        },
                        {
                            "name": "size",
                            "description": "Resource size.",
                            "type": "integer"
                        },
                        {
                            "name": "type",
                            "description": "Resource type.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "ApplicationCache",
                    "description": "Detailed application cache information.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "manifestURL",
                            "description": "Manifest URL.",
                            "type": "string"
                        },
                        {
                            "name": "size",
                            "description": "Application cache size.",
                            "type": "number"
                        },
                        {
                            "name": "creationTime",
                            "description": "Application cache creation time.",
                            "type": "number"
                        },
                        {
                            "name": "updateTime",
                            "description": "Application cache update time.",
                            "type": "number"
                        },
                        {
                            "name": "resources",
                            "description": "Application cache resources.",
                            "type": "array",
                            "items": {
                                "$ref": "ApplicationCacheResource"
                            }
                        }
                    ]
                },
                {
                    "id": "FrameWithManifest",
                    "description": "Frame identifier - manifest URL pair.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "frameId",
                            "description": "Frame identifier.",
                            "$ref": "Page.FrameId"
                        },
                        {
                            "name": "manifestURL",
                            "description": "Manifest URL.",
                            "type": "string"
                        },
                        {
                            "name": "status",
                            "description": "Application cache status.",
                            "type": "integer"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "enable",
                    "description": "Enables application cache domain notifications."
                },
                {
                    "name": "getApplicationCacheForFrame",
                    "description": "Returns relevant application cache data for the document in given frame.",
                    "parameters": [
                        {
                            "name": "frameId",
                            "description": "Identifier of the frame containing document whose application cache is retrieved.",
                            "$ref": "Page.FrameId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "applicationCache",
                            "description": "Relevant application cache data for the document in given frame.",
                            "$ref": "ApplicationCache"
                        }
                    ]
                },
                {
                    "name": "getFramesWithManifests",
                    "description": "Returns array of frame identifiers with manifest urls for each frame containing a document\nassociated with some application cache.",
                    "returns": [
                        {
                            "name": "frameIds",
                            "description": "Array of frame identifiers with manifest urls for each frame containing a document\nassociated with some application cache.",
                            "type": "array",
                            "items": {
                                "$ref": "FrameWithManifest"
                            }
                        }
                    ]
                },
                {
                    "name": "getManifestForFrame",
                    "description": "Returns manifest URL for document in the given frame.",
                    "parameters": [
                        {
                            "name": "frameId",
                            "description": "Identifier of the frame containing document whose manifest is retrieved.",
                            "$ref": "Page.FrameId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "manifestURL",
                            "description": "Manifest URL for document in the given frame.",
                            "type": "string"
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "applicationCacheStatusUpdated",
                    "parameters": [
                        {
                            "name": "frameId",
                            "description": "Identifier of the frame containing document whose application cache updated status.",
                            "$ref": "Page.FrameId"
                        },
                        {
                            "name": "manifestURL",
                            "description": "Manifest URL.",
                            "type": "string"
                        },
                        {
                            "name": "status",
                            "description": "Updated application cache status.",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "name": "networkStateUpdated",
                    "parameters": [
                        {
                            "name": "isNowOnline",
                            "type": "boolean"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Audits",
            "description": "Audits domain allows investigation of page violations and possible improvements.",
            "experimental": true,
            "dependencies": [
                "Network"
            ],
            "commands": [
                {
                    "name": "getEncodedResponse",
                    "description": "Returns the response body and size if it were re-encoded with the specified settings. Only\napplies to images.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Identifier of the network request to get content for.",
                            "$ref": "Network.RequestId"
                        },
                        {
                            "name": "encoding",
                            "description": "The encoding to use.",
                            "type": "string",
                            "enum": [
                                "webp",
                                "jpeg",
                                "png"
                            ]
                        },
                        {
                            "name": "quality",
                            "description": "The quality of the encoding (0-1). (defaults to 1)",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "sizeOnly",
                            "description": "Whether to only return the size information (defaults to false).",
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "body",
                            "description": "The encoded body as a base64 string. Omitted if sizeOnly is true.",
                            "optional": true,
                            "type": "binary"
                        },
                        {
                            "name": "originalSize",
                            "description": "Size before re-encoding.",
                            "type": "integer"
                        },
                        {
                            "name": "encodedSize",
                            "description": "Size after re-encoding.",
                            "type": "integer"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Browser",
            "description": "The Browser domain defines methods and events for browser managing.",
            "types": [
                {
                    "id": "WindowID",
                    "experimental": true,
                    "type": "integer"
                },
                {
                    "id": "WindowState",
                    "description": "The state of the browser window.",
                    "experimental": true,
                    "type": "string",
                    "enum": [
                        "normal",
                        "minimized",
                        "maximized",
                        "fullscreen"
                    ]
                },
                {
                    "id": "Bounds",
                    "description": "Browser window bounds information",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "left",
                            "description": "The offset from the left edge of the screen to the window in pixels.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "top",
                            "description": "The offset from the top edge of the screen to the window in pixels.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "width",
                            "description": "The window width in pixels.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "height",
                            "description": "The window height in pixels.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "windowState",
                            "description": "The window state. Default to normal.",
                            "optional": true,
                            "$ref": "WindowState"
                        }
                    ]
                },
                {
                    "id": "PermissionType",
                    "experimental": true,
                    "type": "string",
                    "enum": [
                        "accessibilityEvents",
                        "audioCapture",
                        "backgroundSync",
                        "backgroundFetch",
                        "clipboardRead",
                        "clipboardWrite",
                        "durableStorage",
                        "flash",
                        "geolocation",
                        "midi",
                        "midiSysex",
                        "notifications",
                        "paymentHandler",
                        "protectedMediaIdentifier",
                        "sensors",
                        "videoCapture"
                    ]
                },
                {
                    "id": "Bucket",
                    "description": "Chrome histogram bucket.",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "low",
                            "description": "Minimum value (inclusive).",
                            "type": "integer"
                        },
                        {
                            "name": "high",
                            "description": "Maximum value (exclusive).",
                            "type": "integer"
                        },
                        {
                            "name": "count",
                            "description": "Number of samples.",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "id": "Histogram",
                    "description": "Chrome histogram.",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "name",
                            "description": "Name.",
                            "type": "string"
                        },
                        {
                            "name": "sum",
                            "description": "Sum of sample values.",
                            "type": "integer"
                        },
                        {
                            "name": "count",
                            "description": "Total number of samples.",
                            "type": "integer"
                        },
                        {
                            "name": "buckets",
                            "description": "Buckets.",
                            "type": "array",
                            "items": {
                                "$ref": "Bucket"
                            }
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "grantPermissions",
                    "description": "Grant specific permissions to the given origin and reject all others.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "origin",
                            "type": "string"
                        },
                        {
                            "name": "permissions",
                            "type": "array",
                            "items": {
                                "$ref": "PermissionType"
                            }
                        },
                        {
                            "name": "browserContextId",
                            "description": "BrowserContext to override permissions. When omitted, default browser context is used.",
                            "optional": true,
                            "$ref": "Target.BrowserContextID"
                        }
                    ]
                },
                {
                    "name": "resetPermissions",
                    "description": "Reset all permission management for all origins.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "browserContextId",
                            "description": "BrowserContext to reset permissions. When omitted, default browser context is used.",
                            "optional": true,
                            "$ref": "Target.BrowserContextID"
                        }
                    ]
                },
                {
                    "name": "close",
                    "description": "Close browser gracefully."
                },
                {
                    "name": "crash",
                    "description": "Crashes browser on the main thread.",
                    "experimental": true
                },
                {
                    "name": "getVersion",
                    "description": "Returns version information.",
                    "returns": [
                        {
                            "name": "protocolVersion",
                            "description": "Protocol version.",
                            "type": "string"
                        },
                        {
                            "name": "product",
                            "description": "Product name.",
                            "type": "string"
                        },
                        {
                            "name": "revision",
                            "description": "Product revision.",
                            "type": "string"
                        },
                        {
                            "name": "userAgent",
                            "description": "User-Agent.",
                            "type": "string"
                        },
                        {
                            "name": "jsVersion",
                            "description": "V8 version.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "getBrowserCommandLine",
                    "description": "Returns the command line switches for the browser process if, and only if\n--enable-automation is on the commandline.",
                    "experimental": true,
                    "returns": [
                        {
                            "name": "arguments",
                            "description": "Commandline parameters",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                },
                {
                    "name": "getHistograms",
                    "description": "Get Chrome histograms.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "query",
                            "description": "Requested substring in name. Only histograms which have query as a\nsubstring in their name are extracted. An empty or absent query returns\nall histograms.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "delta",
                            "description": "If true, retrieve delta since last call.",
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "histograms",
                            "description": "Histograms.",
                            "type": "array",
                            "items": {
                                "$ref": "Histogram"
                            }
                        }
                    ]
                },
                {
                    "name": "getHistogram",
                    "description": "Get a Chrome histogram by name.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "name",
                            "description": "Requested histogram name.",
                            "type": "string"
                        },
                        {
                            "name": "delta",
                            "description": "If true, retrieve delta since last call.",
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "histogram",
                            "description": "Histogram.",
                            "$ref": "Histogram"
                        }
                    ]
                },
                {
                    "name": "getWindowBounds",
                    "description": "Get position and size of the browser window.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "windowId",
                            "description": "Browser window id.",
                            "$ref": "WindowID"
                        }
                    ],
                    "returns": [
                        {
                            "name": "bounds",
                            "description": "Bounds information of the window. When window state is 'minimized', the restored window\nposition and size are returned.",
                            "$ref": "Bounds"
                        }
                    ]
                },
                {
                    "name": "getWindowForTarget",
                    "description": "Get the browser window that contains the devtools target.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "targetId",
                            "description": "Devtools agent host id. If called as a part of the session, associated targetId is used.",
                            "optional": true,
                            "$ref": "Target.TargetID"
                        }
                    ],
                    "returns": [
                        {
                            "name": "windowId",
                            "description": "Browser window id.",
                            "$ref": "WindowID"
                        },
                        {
                            "name": "bounds",
                            "description": "Bounds information of the window. When window state is 'minimized', the restored window\nposition and size are returned.",
                            "$ref": "Bounds"
                        }
                    ]
                },
                {
                    "name": "setWindowBounds",
                    "description": "Set position and/or size of the browser window.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "windowId",
                            "description": "Browser window id.",
                            "$ref": "WindowID"
                        },
                        {
                            "name": "bounds",
                            "description": "New window bounds. The 'minimized', 'maximized' and 'fullscreen' states cannot be combined\nwith 'left', 'top', 'width' or 'height'. Leaves unspecified fields unchanged.",
                            "$ref": "Bounds"
                        }
                    ]
                },
                {
                    "name": "setDockTile",
                    "description": "Set dock tile details, platform-specific.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "badgeLabel",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "image",
                            "description": "Png encoded image.",
                            "optional": true,
                            "type": "binary"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "CSS",
            "description": "This domain exposes CSS read/write operations. All CSS objects (stylesheets, rules, and styles)\nhave an associated `id` used in subsequent operations on the related object. Each object type has\na specific `id` structure, and those are not interchangeable between objects of different kinds.\nCSS objects can be loaded using the `get*ForNode()` calls (which accept a DOM node id). A client\ncan also keep track of stylesheets via the `styleSheetAdded`/`styleSheetRemoved` events and\nsubsequently load the required stylesheet contents using the `getStyleSheet[Text]()` methods.",
            "experimental": true,
            "dependencies": [
                "DOM"
            ],
            "types": [
                {
                    "id": "StyleSheetId",
                    "type": "string"
                },
                {
                    "id": "StyleSheetOrigin",
                    "description": "Stylesheet type: \"injected\" for stylesheets injected via extension, \"user-agent\" for user-agent\nstylesheets, \"inspector\" for stylesheets created by the inspector (i.e. those holding the \"via\ninspector\" rules), \"regular\" for regular stylesheets.",
                    "type": "string",
                    "enum": [
                        "injected",
                        "user-agent",
                        "inspector",
                        "regular"
                    ]
                },
                {
                    "id": "PseudoElementMatches",
                    "description": "CSS rule collection for a single pseudo style.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "pseudoType",
                            "description": "Pseudo element type.",
                            "$ref": "DOM.PseudoType"
                        },
                        {
                            "name": "matches",
                            "description": "Matches of CSS rules applicable to the pseudo style.",
                            "type": "array",
                            "items": {
                                "$ref": "RuleMatch"
                            }
                        }
                    ]
                },
                {
                    "id": "InheritedStyleEntry",
                    "description": "Inherited CSS rule collection from ancestor node.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "inlineStyle",
                            "description": "The ancestor node's inline style, if any, in the style inheritance chain.",
                            "optional": true,
                            "$ref": "CSSStyle"
                        },
                        {
                            "name": "matchedCSSRules",
                            "description": "Matches of CSS rules matching the ancestor node in the style inheritance chain.",
                            "type": "array",
                            "items": {
                                "$ref": "RuleMatch"
                            }
                        }
                    ]
                },
                {
                    "id": "RuleMatch",
                    "description": "Match data for a CSS rule.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "rule",
                            "description": "CSS rule in the match.",
                            "$ref": "CSSRule"
                        },
                        {
                            "name": "matchingSelectors",
                            "description": "Matching selector indices in the rule's selectorList selectors (0-based).",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        }
                    ]
                },
                {
                    "id": "Value",
                    "description": "Data for a simple selector (these are delimited by commas in a selector list).",
                    "type": "object",
                    "properties": [
                        {
                            "name": "text",
                            "description": "Value text.",
                            "type": "string"
                        },
                        {
                            "name": "range",
                            "description": "Value range in the underlying resource (if available).",
                            "optional": true,
                            "$ref": "SourceRange"
                        }
                    ]
                },
                {
                    "id": "SelectorList",
                    "description": "Selector list data.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "selectors",
                            "description": "Selectors in the list.",
                            "type": "array",
                            "items": {
                                "$ref": "Value"
                            }
                        },
                        {
                            "name": "text",
                            "description": "Rule selector text.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "CSSStyleSheetHeader",
                    "description": "CSS stylesheet metainformation.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "styleSheetId",
                            "description": "The stylesheet identifier.",
                            "$ref": "StyleSheetId"
                        },
                        {
                            "name": "frameId",
                            "description": "Owner frame identifier.",
                            "$ref": "Page.FrameId"
                        },
                        {
                            "name": "sourceURL",
                            "description": "Stylesheet resource URL.",
                            "type": "string"
                        },
                        {
                            "name": "sourceMapURL",
                            "description": "URL of source map associated with the stylesheet (if any).",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "origin",
                            "description": "Stylesheet origin.",
                            "$ref": "StyleSheetOrigin"
                        },
                        {
                            "name": "title",
                            "description": "Stylesheet title.",
                            "type": "string"
                        },
                        {
                            "name": "ownerNode",
                            "description": "The backend id for the owner node of the stylesheet.",
                            "optional": true,
                            "$ref": "DOM.BackendNodeId"
                        },
                        {
                            "name": "disabled",
                            "description": "Denotes whether the stylesheet is disabled.",
                            "type": "boolean"
                        },
                        {
                            "name": "hasSourceURL",
                            "description": "Whether the sourceURL field value comes from the sourceURL comment.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "isInline",
                            "description": "Whether this stylesheet is created for STYLE tag by parser. This flag is not set for\ndocument.written STYLE tags.",
                            "type": "boolean"
                        },
                        {
                            "name": "startLine",
                            "description": "Line offset of the stylesheet within the resource (zero based).",
                            "type": "number"
                        },
                        {
                            "name": "startColumn",
                            "description": "Column offset of the stylesheet within the resource (zero based).",
                            "type": "number"
                        },
                        {
                            "name": "length",
                            "description": "Size of the content (in characters).",
                            "type": "number"
                        }
                    ]
                },
                {
                    "id": "CSSRule",
                    "description": "CSS rule representation.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "styleSheetId",
                            "description": "The css style sheet identifier (absent for user agent stylesheet and user-specified\nstylesheet rules) this rule came from.",
                            "optional": true,
                            "$ref": "StyleSheetId"
                        },
                        {
                            "name": "selectorList",
                            "description": "Rule selector data.",
                            "$ref": "SelectorList"
                        },
                        {
                            "name": "origin",
                            "description": "Parent stylesheet's origin.",
                            "$ref": "StyleSheetOrigin"
                        },
                        {
                            "name": "style",
                            "description": "Associated style declaration.",
                            "$ref": "CSSStyle"
                        },
                        {
                            "name": "media",
                            "description": "Media list array (for rules involving media queries). The array enumerates media queries\nstarting with the innermost one, going outwards.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "CSSMedia"
                            }
                        }
                    ]
                },
                {
                    "id": "RuleUsage",
                    "description": "CSS coverage information.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "styleSheetId",
                            "description": "The css style sheet identifier (absent for user agent stylesheet and user-specified\nstylesheet rules) this rule came from.",
                            "$ref": "StyleSheetId"
                        },
                        {
                            "name": "startOffset",
                            "description": "Offset of the start of the rule (including selector) from the beginning of the stylesheet.",
                            "type": "number"
                        },
                        {
                            "name": "endOffset",
                            "description": "Offset of the end of the rule body from the beginning of the stylesheet.",
                            "type": "number"
                        },
                        {
                            "name": "used",
                            "description": "Indicates whether the rule was actually used by some element in the page.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "id": "SourceRange",
                    "description": "Text range within a resource. All numbers are zero-based.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "startLine",
                            "description": "Start line of range.",
                            "type": "integer"
                        },
                        {
                            "name": "startColumn",
                            "description": "Start column of range (inclusive).",
                            "type": "integer"
                        },
                        {
                            "name": "endLine",
                            "description": "End line of range",
                            "type": "integer"
                        },
                        {
                            "name": "endColumn",
                            "description": "End column of range (exclusive).",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "id": "ShorthandEntry",
                    "type": "object",
                    "properties": [
                        {
                            "name": "name",
                            "description": "Shorthand name.",
                            "type": "string"
                        },
                        {
                            "name": "value",
                            "description": "Shorthand value.",
                            "type": "string"
                        },
                        {
                            "name": "important",
                            "description": "Whether the property has \"!important\" annotation (implies `false` if absent).",
                            "optional": true,
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "id": "CSSComputedStyleProperty",
                    "type": "object",
                    "properties": [
                        {
                            "name": "name",
                            "description": "Computed style property name.",
                            "type": "string"
                        },
                        {
                            "name": "value",
                            "description": "Computed style property value.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "CSSStyle",
                    "description": "CSS style representation.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "styleSheetId",
                            "description": "The css style sheet identifier (absent for user agent stylesheet and user-specified\nstylesheet rules) this rule came from.",
                            "optional": true,
                            "$ref": "StyleSheetId"
                        },
                        {
                            "name": "cssProperties",
                            "description": "CSS properties in the style.",
                            "type": "array",
                            "items": {
                                "$ref": "CSSProperty"
                            }
                        },
                        {
                            "name": "shorthandEntries",
                            "description": "Computed values for all shorthands found in the style.",
                            "type": "array",
                            "items": {
                                "$ref": "ShorthandEntry"
                            }
                        },
                        {
                            "name": "cssText",
                            "description": "Style declaration text (if available).",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "range",
                            "description": "Style declaration range in the enclosing stylesheet (if available).",
                            "optional": true,
                            "$ref": "SourceRange"
                        }
                    ]
                },
                {
                    "id": "CSSProperty",
                    "description": "CSS property declaration data.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "name",
                            "description": "The property name.",
                            "type": "string"
                        },
                        {
                            "name": "value",
                            "description": "The property value.",
                            "type": "string"
                        },
                        {
                            "name": "important",
                            "description": "Whether the property has \"!important\" annotation (implies `false` if absent).",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "implicit",
                            "description": "Whether the property is implicit (implies `false` if absent).",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "text",
                            "description": "The full property text as specified in the style.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "parsedOk",
                            "description": "Whether the property is understood by the browser (implies `true` if absent).",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "disabled",
                            "description": "Whether the property is disabled by the user (present for source-based properties only).",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "range",
                            "description": "The entire property range in the enclosing style declaration (if available).",
                            "optional": true,
                            "$ref": "SourceRange"
                        }
                    ]
                },
                {
                    "id": "CSSMedia",
                    "description": "CSS media rule descriptor.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "text",
                            "description": "Media query text.",
                            "type": "string"
                        },
                        {
                            "name": "source",
                            "description": "Source of the media query: \"mediaRule\" if specified by a @media rule, \"importRule\" if\nspecified by an @import rule, \"linkedSheet\" if specified by a \"media\" attribute in a linked\nstylesheet's LINK tag, \"inlineSheet\" if specified by a \"media\" attribute in an inline\nstylesheet's STYLE tag.",
                            "type": "string",
                            "enum": [
                                "mediaRule",
                                "importRule",
                                "linkedSheet",
                                "inlineSheet"
                            ]
                        },
                        {
                            "name": "sourceURL",
                            "description": "URL of the document containing the media query description.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "range",
                            "description": "The associated rule (@media or @import) header range in the enclosing stylesheet (if\navailable).",
                            "optional": true,
                            "$ref": "SourceRange"
                        },
                        {
                            "name": "styleSheetId",
                            "description": "Identifier of the stylesheet containing this object (if exists).",
                            "optional": true,
                            "$ref": "StyleSheetId"
                        },
                        {
                            "name": "mediaList",
                            "description": "Array of media queries.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "MediaQuery"
                            }
                        }
                    ]
                },
                {
                    "id": "MediaQuery",
                    "description": "Media query descriptor.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "expressions",
                            "description": "Array of media query expressions.",
                            "type": "array",
                            "items": {
                                "$ref": "MediaQueryExpression"
                            }
                        },
                        {
                            "name": "active",
                            "description": "Whether the media query condition is satisfied.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "id": "MediaQueryExpression",
                    "description": "Media query expression descriptor.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "value",
                            "description": "Media query expression value.",
                            "type": "number"
                        },
                        {
                            "name": "unit",
                            "description": "Media query expression units.",
                            "type": "string"
                        },
                        {
                            "name": "feature",
                            "description": "Media query expression feature.",
                            "type": "string"
                        },
                        {
                            "name": "valueRange",
                            "description": "The associated range of the value text in the enclosing stylesheet (if available).",
                            "optional": true,
                            "$ref": "SourceRange"
                        },
                        {
                            "name": "computedLength",
                            "description": "Computed length of media query expression (if applicable).",
                            "optional": true,
                            "type": "number"
                        }
                    ]
                },
                {
                    "id": "PlatformFontUsage",
                    "description": "Information about amount of glyphs that were rendered with given font.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "familyName",
                            "description": "Font's family name reported by platform.",
                            "type": "string"
                        },
                        {
                            "name": "isCustomFont",
                            "description": "Indicates if the font was downloaded or resolved locally.",
                            "type": "boolean"
                        },
                        {
                            "name": "glyphCount",
                            "description": "Amount of glyphs that were rendered with this font.",
                            "type": "number"
                        }
                    ]
                },
                {
                    "id": "FontFace",
                    "description": "Properties of a web font: https://www.w3.org/TR/2008/REC-CSS2-20080411/fonts.html#font-descriptions",
                    "type": "object",
                    "properties": [
                        {
                            "name": "fontFamily",
                            "description": "The font-family.",
                            "type": "string"
                        },
                        {
                            "name": "fontStyle",
                            "description": "The font-style.",
                            "type": "string"
                        },
                        {
                            "name": "fontVariant",
                            "description": "The font-variant.",
                            "type": "string"
                        },
                        {
                            "name": "fontWeight",
                            "description": "The font-weight.",
                            "type": "string"
                        },
                        {
                            "name": "fontStretch",
                            "description": "The font-stretch.",
                            "type": "string"
                        },
                        {
                            "name": "unicodeRange",
                            "description": "The unicode-range.",
                            "type": "string"
                        },
                        {
                            "name": "src",
                            "description": "The src.",
                            "type": "string"
                        },
                        {
                            "name": "platformFontFamily",
                            "description": "The resolved platform font family",
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "CSSKeyframesRule",
                    "description": "CSS keyframes rule representation.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "animationName",
                            "description": "Animation name.",
                            "$ref": "Value"
                        },
                        {
                            "name": "keyframes",
                            "description": "List of keyframes.",
                            "type": "array",
                            "items": {
                                "$ref": "CSSKeyframeRule"
                            }
                        }
                    ]
                },
                {
                    "id": "CSSKeyframeRule",
                    "description": "CSS keyframe rule representation.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "styleSheetId",
                            "description": "The css style sheet identifier (absent for user agent stylesheet and user-specified\nstylesheet rules) this rule came from.",
                            "optional": true,
                            "$ref": "StyleSheetId"
                        },
                        {
                            "name": "origin",
                            "description": "Parent stylesheet's origin.",
                            "$ref": "StyleSheetOrigin"
                        },
                        {
                            "name": "keyText",
                            "description": "Associated key text.",
                            "$ref": "Value"
                        },
                        {
                            "name": "style",
                            "description": "Associated style declaration.",
                            "$ref": "CSSStyle"
                        }
                    ]
                },
                {
                    "id": "StyleDeclarationEdit",
                    "description": "A descriptor of operation to mutate style declaration text.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "styleSheetId",
                            "description": "The css style sheet identifier.",
                            "$ref": "StyleSheetId"
                        },
                        {
                            "name": "range",
                            "description": "The range of the style text in the enclosing stylesheet.",
                            "$ref": "SourceRange"
                        },
                        {
                            "name": "text",
                            "description": "New style text.",
                            "type": "string"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "addRule",
                    "description": "Inserts a new rule with the given `ruleText` in a stylesheet with given `styleSheetId`, at the\nposition specified by `location`.",
                    "parameters": [
                        {
                            "name": "styleSheetId",
                            "description": "The css style sheet identifier where a new rule should be inserted.",
                            "$ref": "StyleSheetId"
                        },
                        {
                            "name": "ruleText",
                            "description": "The text of a new rule.",
                            "type": "string"
                        },
                        {
                            "name": "location",
                            "description": "Text position of a new rule in the target style sheet.",
                            "$ref": "SourceRange"
                        }
                    ],
                    "returns": [
                        {
                            "name": "rule",
                            "description": "The newly created rule.",
                            "$ref": "CSSRule"
                        }
                    ]
                },
                {
                    "name": "collectClassNames",
                    "description": "Returns all class names from specified stylesheet.",
                    "parameters": [
                        {
                            "name": "styleSheetId",
                            "$ref": "StyleSheetId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "classNames",
                            "description": "Class name list.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                },
                {
                    "name": "createStyleSheet",
                    "description": "Creates a new special \"via-inspector\" stylesheet in the frame with given `frameId`.",
                    "parameters": [
                        {
                            "name": "frameId",
                            "description": "Identifier of the frame where \"via-inspector\" stylesheet should be created.",
                            "$ref": "Page.FrameId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "styleSheetId",
                            "description": "Identifier of the created \"via-inspector\" stylesheet.",
                            "$ref": "StyleSheetId"
                        }
                    ]
                },
                {
                    "name": "disable",
                    "description": "Disables the CSS agent for the given page."
                },
                {
                    "name": "enable",
                    "description": "Enables the CSS agent for the given page. Clients should not assume that the CSS agent has been\nenabled until the result of this command is received."
                },
                {
                    "name": "forcePseudoState",
                    "description": "Ensures that the given node will have specified pseudo-classes whenever its style is computed by\nthe browser.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "The element id for which to force the pseudo state.",
                            "$ref": "DOM.NodeId"
                        },
                        {
                            "name": "forcedPseudoClasses",
                            "description": "Element pseudo classes to force when computing the element's style.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                },
                {
                    "name": "getBackgroundColors",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node to get background colors for.",
                            "$ref": "DOM.NodeId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "backgroundColors",
                            "description": "The range of background colors behind this element, if it contains any visible text. If no\nvisible text is present, this will be undefined. In the case of a flat background color,\nthis will consist of simply that color. In the case of a gradient, this will consist of each\nof the color stops. For anything more complicated, this will be an empty array. Images will\nbe ignored (as if the image had failed to load).",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "computedFontSize",
                            "description": "The computed font size for this node, as a CSS computed value string (e.g. '12px').",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "computedFontWeight",
                            "description": "The computed font weight for this node, as a CSS computed value string (e.g. 'normal' or\n'100').",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "computedBodyFontSize",
                            "description": "The computed font size for the document body, as a computed CSS value string (e.g. '16px').",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "getComputedStyleForNode",
                    "description": "Returns the computed style for a DOM node identified by `nodeId`.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "$ref": "DOM.NodeId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "computedStyle",
                            "description": "Computed style for the specified DOM node.",
                            "type": "array",
                            "items": {
                                "$ref": "CSSComputedStyleProperty"
                            }
                        }
                    ]
                },
                {
                    "name": "getInlineStylesForNode",
                    "description": "Returns the styles defined inline (explicitly in the \"style\" attribute and implicitly, using DOM\nattributes) for a DOM node identified by `nodeId`.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "$ref": "DOM.NodeId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "inlineStyle",
                            "description": "Inline style for the specified DOM node.",
                            "optional": true,
                            "$ref": "CSSStyle"
                        },
                        {
                            "name": "attributesStyle",
                            "description": "Attribute-defined element style (e.g. resulting from \"width=20 height=100%\").",
                            "optional": true,
                            "$ref": "CSSStyle"
                        }
                    ]
                },
                {
                    "name": "getMatchedStylesForNode",
                    "description": "Returns requested styles for a DOM node identified by `nodeId`.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "$ref": "DOM.NodeId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "inlineStyle",
                            "description": "Inline style for the specified DOM node.",
                            "optional": true,
                            "$ref": "CSSStyle"
                        },
                        {
                            "name": "attributesStyle",
                            "description": "Attribute-defined element style (e.g. resulting from \"width=20 height=100%\").",
                            "optional": true,
                            "$ref": "CSSStyle"
                        },
                        {
                            "name": "matchedCSSRules",
                            "description": "CSS rules matching this node, from all applicable stylesheets.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "RuleMatch"
                            }
                        },
                        {
                            "name": "pseudoElements",
                            "description": "Pseudo style matches for this node.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "PseudoElementMatches"
                            }
                        },
                        {
                            "name": "inherited",
                            "description": "A chain of inherited styles (from the immediate node parent up to the DOM tree root).",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "InheritedStyleEntry"
                            }
                        },
                        {
                            "name": "cssKeyframesRules",
                            "description": "A list of CSS keyframed animations matching this node.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "CSSKeyframesRule"
                            }
                        }
                    ]
                },
                {
                    "name": "getMediaQueries",
                    "description": "Returns all media queries parsed by the rendering engine.",
                    "returns": [
                        {
                            "name": "medias",
                            "type": "array",
                            "items": {
                                "$ref": "CSSMedia"
                            }
                        }
                    ]
                },
                {
                    "name": "getPlatformFontsForNode",
                    "description": "Requests information about platform fonts which we used to render child TextNodes in the given\nnode.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "$ref": "DOM.NodeId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "fonts",
                            "description": "Usage statistics for every employed platform font.",
                            "type": "array",
                            "items": {
                                "$ref": "PlatformFontUsage"
                            }
                        }
                    ]
                },
                {
                    "name": "getStyleSheetText",
                    "description": "Returns the current textual content for a stylesheet.",
                    "parameters": [
                        {
                            "name": "styleSheetId",
                            "$ref": "StyleSheetId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "text",
                            "description": "The stylesheet text.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "setEffectivePropertyValueForNode",
                    "description": "Find a rule with the given active property for the given node and set the new value for this\nproperty",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "The element id for which to set property.",
                            "$ref": "DOM.NodeId"
                        },
                        {
                            "name": "propertyName",
                            "type": "string"
                        },
                        {
                            "name": "value",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "setKeyframeKey",
                    "description": "Modifies the keyframe rule key text.",
                    "parameters": [
                        {
                            "name": "styleSheetId",
                            "$ref": "StyleSheetId"
                        },
                        {
                            "name": "range",
                            "$ref": "SourceRange"
                        },
                        {
                            "name": "keyText",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "keyText",
                            "description": "The resulting key text after modification.",
                            "$ref": "Value"
                        }
                    ]
                },
                {
                    "name": "setMediaText",
                    "description": "Modifies the rule selector.",
                    "parameters": [
                        {
                            "name": "styleSheetId",
                            "$ref": "StyleSheetId"
                        },
                        {
                            "name": "range",
                            "$ref": "SourceRange"
                        },
                        {
                            "name": "text",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "media",
                            "description": "The resulting CSS media rule after modification.",
                            "$ref": "CSSMedia"
                        }
                    ]
                },
                {
                    "name": "setRuleSelector",
                    "description": "Modifies the rule selector.",
                    "parameters": [
                        {
                            "name": "styleSheetId",
                            "$ref": "StyleSheetId"
                        },
                        {
                            "name": "range",
                            "$ref": "SourceRange"
                        },
                        {
                            "name": "selector",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "selectorList",
                            "description": "The resulting selector list after modification.",
                            "$ref": "SelectorList"
                        }
                    ]
                },
                {
                    "name": "setStyleSheetText",
                    "description": "Sets the new stylesheet text.",
                    "parameters": [
                        {
                            "name": "styleSheetId",
                            "$ref": "StyleSheetId"
                        },
                        {
                            "name": "text",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "sourceMapURL",
                            "description": "URL of source map associated with script (if any).",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "setStyleTexts",
                    "description": "Applies specified style edits one after another in the given order.",
                    "parameters": [
                        {
                            "name": "edits",
                            "type": "array",
                            "items": {
                                "$ref": "StyleDeclarationEdit"
                            }
                        }
                    ],
                    "returns": [
                        {
                            "name": "styles",
                            "description": "The resulting styles after modification.",
                            "type": "array",
                            "items": {
                                "$ref": "CSSStyle"
                            }
                        }
                    ]
                },
                {
                    "name": "startRuleUsageTracking",
                    "description": "Enables the selector recording."
                },
                {
                    "name": "stopRuleUsageTracking",
                    "description": "Stop tracking rule usage and return the list of rules that were used since last call to\n`takeCoverageDelta` (or since start of coverage instrumentation)",
                    "returns": [
                        {
                            "name": "ruleUsage",
                            "type": "array",
                            "items": {
                                "$ref": "RuleUsage"
                            }
                        }
                    ]
                },
                {
                    "name": "takeCoverageDelta",
                    "description": "Obtain list of rules that became used since last call to this method (or since start of coverage\ninstrumentation)",
                    "returns": [
                        {
                            "name": "coverage",
                            "type": "array",
                            "items": {
                                "$ref": "RuleUsage"
                            }
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "fontsUpdated",
                    "description": "Fires whenever a web font is updated.  A non-empty font parameter indicates a successfully loaded\nweb font",
                    "parameters": [
                        {
                            "name": "font",
                            "description": "The web font that has loaded.",
                            "optional": true,
                            "$ref": "FontFace"
                        }
                    ]
                },
                {
                    "name": "mediaQueryResultChanged",
                    "description": "Fires whenever a MediaQuery result changes (for example, after a browser window has been\nresized.) The current implementation considers only viewport-dependent media features."
                },
                {
                    "name": "styleSheetAdded",
                    "description": "Fired whenever an active document stylesheet is added.",
                    "parameters": [
                        {
                            "name": "header",
                            "description": "Added stylesheet metainfo.",
                            "$ref": "CSSStyleSheetHeader"
                        }
                    ]
                },
                {
                    "name": "styleSheetChanged",
                    "description": "Fired whenever a stylesheet is changed as a result of the client operation.",
                    "parameters": [
                        {
                            "name": "styleSheetId",
                            "$ref": "StyleSheetId"
                        }
                    ]
                },
                {
                    "name": "styleSheetRemoved",
                    "description": "Fired whenever an active document stylesheet is removed.",
                    "parameters": [
                        {
                            "name": "styleSheetId",
                            "description": "Identifier of the removed stylesheet.",
                            "$ref": "StyleSheetId"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "CacheStorage",
            "experimental": true,
            "types": [
                {
                    "id": "CacheId",
                    "description": "Unique identifier of the Cache object.",
                    "type": "string"
                },
                {
                    "id": "CachedResponseType",
                    "description": "type of HTTP response cached",
                    "type": "string",
                    "enum": [
                        "basic",
                        "cors",
                        "default",
                        "error",
                        "opaqueResponse",
                        "opaqueRedirect"
                    ]
                },
                {
                    "id": "DataEntry",
                    "description": "Data entry.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "requestURL",
                            "description": "Request URL.",
                            "type": "string"
                        },
                        {
                            "name": "requestMethod",
                            "description": "Request method.",
                            "type": "string"
                        },
                        {
                            "name": "requestHeaders",
                            "description": "Request headers",
                            "type": "array",
                            "items": {
                                "$ref": "Header"
                            }
                        },
                        {
                            "name": "responseTime",
                            "description": "Number of seconds since epoch.",
                            "type": "number"
                        },
                        {
                            "name": "responseStatus",
                            "description": "HTTP response status code.",
                            "type": "integer"
                        },
                        {
                            "name": "responseStatusText",
                            "description": "HTTP response status text.",
                            "type": "string"
                        },
                        {
                            "name": "responseType",
                            "description": "HTTP response type",
                            "$ref": "CachedResponseType"
                        },
                        {
                            "name": "responseHeaders",
                            "description": "Response headers",
                            "type": "array",
                            "items": {
                                "$ref": "Header"
                            }
                        }
                    ]
                },
                {
                    "id": "Cache",
                    "description": "Cache identifier.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "cacheId",
                            "description": "An opaque unique id of the cache.",
                            "$ref": "CacheId"
                        },
                        {
                            "name": "securityOrigin",
                            "description": "Security origin of the cache.",
                            "type": "string"
                        },
                        {
                            "name": "cacheName",
                            "description": "The name of the cache.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "Header",
                    "type": "object",
                    "properties": [
                        {
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "name": "value",
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "CachedResponse",
                    "description": "Cached response",
                    "type": "object",
                    "properties": [
                        {
                            "name": "body",
                            "description": "Entry content, base64-encoded.",
                            "type": "binary"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "deleteCache",
                    "description": "Deletes a cache.",
                    "parameters": [
                        {
                            "name": "cacheId",
                            "description": "Id of cache for deletion.",
                            "$ref": "CacheId"
                        }
                    ]
                },
                {
                    "name": "deleteEntry",
                    "description": "Deletes a cache entry.",
                    "parameters": [
                        {
                            "name": "cacheId",
                            "description": "Id of cache where the entry will be deleted.",
                            "$ref": "CacheId"
                        },
                        {
                            "name": "request",
                            "description": "URL spec of the request.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "requestCacheNames",
                    "description": "Requests cache names.",
                    "parameters": [
                        {
                            "name": "securityOrigin",
                            "description": "Security origin.",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "caches",
                            "description": "Caches for the security origin.",
                            "type": "array",
                            "items": {
                                "$ref": "Cache"
                            }
                        }
                    ]
                },
                {
                    "name": "requestCachedResponse",
                    "description": "Fetches cache entry.",
                    "parameters": [
                        {
                            "name": "cacheId",
                            "description": "Id of cache that contains the enty.",
                            "$ref": "CacheId"
                        },
                        {
                            "name": "requestURL",
                            "description": "URL spec of the request.",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "response",
                            "description": "Response read from the cache.",
                            "$ref": "CachedResponse"
                        }
                    ]
                },
                {
                    "name": "requestEntries",
                    "description": "Requests data from cache.",
                    "parameters": [
                        {
                            "name": "cacheId",
                            "description": "ID of cache to get entries from.",
                            "$ref": "CacheId"
                        },
                        {
                            "name": "skipCount",
                            "description": "Number of records to skip.",
                            "type": "integer"
                        },
                        {
                            "name": "pageSize",
                            "description": "Number of records to fetch.",
                            "type": "integer"
                        }
                    ],
                    "returns": [
                        {
                            "name": "cacheDataEntries",
                            "description": "Array of object store data entries.",
                            "type": "array",
                            "items": {
                                "$ref": "DataEntry"
                            }
                        },
                        {
                            "name": "hasMore",
                            "description": "If true, there are more entries to fetch in the given range.",
                            "type": "boolean"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "DOM",
            "description": "This domain exposes DOM read/write operations. Each DOM Node is represented with its mirror object\nthat has an `id`. This `id` can be used to get additional information on the Node, resolve it into\nthe JavaScript object wrapper, etc. It is important that client receives DOM events only for the\nnodes that are known to the client. Backend keeps track of the nodes that were sent to the client\nand never sends the same node twice. It is client's responsibility to collect information about\nthe nodes that were sent to the client.<p>Note that `iframe` owner elements will return\ncorresponding document elements as their child nodes.</p>",
            "dependencies": [
                "Runtime"
            ],
            "types": [
                {
                    "id": "NodeId",
                    "description": "Unique DOM node identifier.",
                    "type": "integer"
                },
                {
                    "id": "BackendNodeId",
                    "description": "Unique DOM node identifier used to reference a node that may not have been pushed to the\nfront-end.",
                    "type": "integer"
                },
                {
                    "id": "BackendNode",
                    "description": "Backend node with a friendly name.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "nodeType",
                            "description": "`Node`'s nodeType.",
                            "type": "integer"
                        },
                        {
                            "name": "nodeName",
                            "description": "`Node`'s nodeName.",
                            "type": "string"
                        },
                        {
                            "name": "backendNodeId",
                            "$ref": "BackendNodeId"
                        }
                    ]
                },
                {
                    "id": "PseudoType",
                    "description": "Pseudo element type.",
                    "type": "string",
                    "enum": [
                        "first-line",
                        "first-letter",
                        "before",
                        "after",
                        "backdrop",
                        "selection",
                        "first-line-inherited",
                        "scrollbar",
                        "scrollbar-thumb",
                        "scrollbar-button",
                        "scrollbar-track",
                        "scrollbar-track-piece",
                        "scrollbar-corner",
                        "resizer",
                        "input-list-button"
                    ]
                },
                {
                    "id": "ShadowRootType",
                    "description": "Shadow root type.",
                    "type": "string",
                    "enum": [
                        "user-agent",
                        "open",
                        "closed"
                    ]
                },
                {
                    "id": "Node",
                    "description": "DOM interaction is implemented in terms of mirror objects that represent the actual DOM nodes.\nDOMNode is a base node mirror type.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "nodeId",
                            "description": "Node identifier that is passed into the rest of the DOM messages as the `nodeId`. Backend\nwill only push node with given `id` once. It is aware of all requested nodes and will only\nfire DOM events for nodes known to the client.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "parentId",
                            "description": "The id of the parent node if any.",
                            "optional": true,
                            "$ref": "NodeId"
                        },
                        {
                            "name": "backendNodeId",
                            "description": "The BackendNodeId for this node.",
                            "$ref": "BackendNodeId"
                        },
                        {
                            "name": "nodeType",
                            "description": "`Node`'s nodeType.",
                            "type": "integer"
                        },
                        {
                            "name": "nodeName",
                            "description": "`Node`'s nodeName.",
                            "type": "string"
                        },
                        {
                            "name": "localName",
                            "description": "`Node`'s localName.",
                            "type": "string"
                        },
                        {
                            "name": "nodeValue",
                            "description": "`Node`'s nodeValue.",
                            "type": "string"
                        },
                        {
                            "name": "childNodeCount",
                            "description": "Child count for `Container` nodes.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "children",
                            "description": "Child nodes of this node when requested with children.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "Node"
                            }
                        },
                        {
                            "name": "attributes",
                            "description": "Attributes of the `Element` node in the form of flat array `[name1, value1, name2, value2]`.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "documentURL",
                            "description": "Document URL that `Document` or `FrameOwner` node points to.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "baseURL",
                            "description": "Base URL that `Document` or `FrameOwner` node uses for URL completion.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "publicId",
                            "description": "`DocumentType`'s publicId.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "systemId",
                            "description": "`DocumentType`'s systemId.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "internalSubset",
                            "description": "`DocumentType`'s internalSubset.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "xmlVersion",
                            "description": "`Document`'s XML version in case of XML documents.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "name",
                            "description": "`Attr`'s name.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "value",
                            "description": "`Attr`'s value.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "pseudoType",
                            "description": "Pseudo element type for this node.",
                            "optional": true,
                            "$ref": "PseudoType"
                        },
                        {
                            "name": "shadowRootType",
                            "description": "Shadow root type.",
                            "optional": true,
                            "$ref": "ShadowRootType"
                        },
                        {
                            "name": "frameId",
                            "description": "Frame ID for frame owner elements.",
                            "optional": true,
                            "$ref": "Page.FrameId"
                        },
                        {
                            "name": "contentDocument",
                            "description": "Content document for frame owner elements.",
                            "optional": true,
                            "$ref": "Node"
                        },
                        {
                            "name": "shadowRoots",
                            "description": "Shadow root list for given element host.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "Node"
                            }
                        },
                        {
                            "name": "templateContent",
                            "description": "Content document fragment for template elements.",
                            "optional": true,
                            "$ref": "Node"
                        },
                        {
                            "name": "pseudoElements",
                            "description": "Pseudo elements associated with this node.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "Node"
                            }
                        },
                        {
                            "name": "importedDocument",
                            "description": "Import document for the HTMLImport links.",
                            "optional": true,
                            "$ref": "Node"
                        },
                        {
                            "name": "distributedNodes",
                            "description": "Distributed nodes for given insertion point.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "BackendNode"
                            }
                        },
                        {
                            "name": "isSVG",
                            "description": "Whether the node is SVG.",
                            "optional": true,
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "id": "RGBA",
                    "description": "A structure holding an RGBA color.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "r",
                            "description": "The red component, in the [0-255] range.",
                            "type": "integer"
                        },
                        {
                            "name": "g",
                            "description": "The green component, in the [0-255] range.",
                            "type": "integer"
                        },
                        {
                            "name": "b",
                            "description": "The blue component, in the [0-255] range.",
                            "type": "integer"
                        },
                        {
                            "name": "a",
                            "description": "The alpha component, in the [0-1] range (default: 1).",
                            "optional": true,
                            "type": "number"
                        }
                    ]
                },
                {
                    "id": "Quad",
                    "description": "An array of quad vertices, x immediately followed by y for each point, points clock-wise.",
                    "type": "array",
                    "items": {
                        "type": "number"
                    }
                },
                {
                    "id": "BoxModel",
                    "description": "Box model.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "content",
                            "description": "Content box",
                            "$ref": "Quad"
                        },
                        {
                            "name": "padding",
                            "description": "Padding box",
                            "$ref": "Quad"
                        },
                        {
                            "name": "border",
                            "description": "Border box",
                            "$ref": "Quad"
                        },
                        {
                            "name": "margin",
                            "description": "Margin box",
                            "$ref": "Quad"
                        },
                        {
                            "name": "width",
                            "description": "Node width",
                            "type": "integer"
                        },
                        {
                            "name": "height",
                            "description": "Node height",
                            "type": "integer"
                        },
                        {
                            "name": "shapeOutside",
                            "description": "Shape outside coordinates",
                            "optional": true,
                            "$ref": "ShapeOutsideInfo"
                        }
                    ]
                },
                {
                    "id": "ShapeOutsideInfo",
                    "description": "CSS Shape Outside details.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "bounds",
                            "description": "Shape bounds",
                            "$ref": "Quad"
                        },
                        {
                            "name": "shape",
                            "description": "Shape coordinate details",
                            "type": "array",
                            "items": {
                                "type": "any"
                            }
                        },
                        {
                            "name": "marginShape",
                            "description": "Margin shape bounds",
                            "type": "array",
                            "items": {
                                "type": "any"
                            }
                        }
                    ]
                },
                {
                    "id": "Rect",
                    "description": "Rectangle.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "x",
                            "description": "X coordinate",
                            "type": "number"
                        },
                        {
                            "name": "y",
                            "description": "Y coordinate",
                            "type": "number"
                        },
                        {
                            "name": "width",
                            "description": "Rectangle width",
                            "type": "number"
                        },
                        {
                            "name": "height",
                            "description": "Rectangle height",
                            "type": "number"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "collectClassNamesFromSubtree",
                    "description": "Collects class names for the node with given id and all of it's child nodes.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node to collect class names.",
                            "$ref": "NodeId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "classNames",
                            "description": "Class name list.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                },
                {
                    "name": "copyTo",
                    "description": "Creates a deep copy of the specified node and places it into the target container before the\ngiven anchor.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node to copy.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "targetNodeId",
                            "description": "Id of the element to drop the copy into.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "insertBeforeNodeId",
                            "description": "Drop the copy before this node (if absent, the copy becomes the last child of\n`targetNodeId`).",
                            "optional": true,
                            "$ref": "NodeId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node clone.",
                            "$ref": "NodeId"
                        }
                    ]
                },
                {
                    "name": "describeNode",
                    "description": "Describes node given its id, does not require domain to be enabled. Does not start tracking any\nobjects, can be used for automation.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Identifier of the node.",
                            "optional": true,
                            "$ref": "NodeId"
                        },
                        {
                            "name": "backendNodeId",
                            "description": "Identifier of the backend node.",
                            "optional": true,
                            "$ref": "BackendNodeId"
                        },
                        {
                            "name": "objectId",
                            "description": "JavaScript object id of the node wrapper.",
                            "optional": true,
                            "$ref": "Runtime.RemoteObjectId"
                        },
                        {
                            "name": "depth",
                            "description": "The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the\nentire subtree or provide an integer larger than 0.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "pierce",
                            "description": "Whether or not iframes and shadow roots should be traversed when returning the subtree\n(default is false).",
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "node",
                            "description": "Node description.",
                            "$ref": "Node"
                        }
                    ]
                },
                {
                    "name": "disable",
                    "description": "Disables DOM agent for the given page."
                },
                {
                    "name": "discardSearchResults",
                    "description": "Discards search results from the session with the given id. `getSearchResults` should no longer\nbe called for that search.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "searchId",
                            "description": "Unique search session identifier.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "enable",
                    "description": "Enables DOM agent for the given page."
                },
                {
                    "name": "focus",
                    "description": "Focuses the given element.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Identifier of the node.",
                            "optional": true,
                            "$ref": "NodeId"
                        },
                        {
                            "name": "backendNodeId",
                            "description": "Identifier of the backend node.",
                            "optional": true,
                            "$ref": "BackendNodeId"
                        },
                        {
                            "name": "objectId",
                            "description": "JavaScript object id of the node wrapper.",
                            "optional": true,
                            "$ref": "Runtime.RemoteObjectId"
                        }
                    ]
                },
                {
                    "name": "getAttributes",
                    "description": "Returns attributes for the specified node.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node to retrieve attibutes for.",
                            "$ref": "NodeId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "attributes",
                            "description": "An interleaved array of node attribute names and values.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                },
                {
                    "name": "getBoxModel",
                    "description": "Returns boxes for the given node.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Identifier of the node.",
                            "optional": true,
                            "$ref": "NodeId"
                        },
                        {
                            "name": "backendNodeId",
                            "description": "Identifier of the backend node.",
                            "optional": true,
                            "$ref": "BackendNodeId"
                        },
                        {
                            "name": "objectId",
                            "description": "JavaScript object id of the node wrapper.",
                            "optional": true,
                            "$ref": "Runtime.RemoteObjectId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "model",
                            "description": "Box model for the node.",
                            "$ref": "BoxModel"
                        }
                    ]
                },
                {
                    "name": "getContentQuads",
                    "description": "Returns quads that describe node position on the page. This method\nmight return multiple quads for inline nodes.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Identifier of the node.",
                            "optional": true,
                            "$ref": "NodeId"
                        },
                        {
                            "name": "backendNodeId",
                            "description": "Identifier of the backend node.",
                            "optional": true,
                            "$ref": "BackendNodeId"
                        },
                        {
                            "name": "objectId",
                            "description": "JavaScript object id of the node wrapper.",
                            "optional": true,
                            "$ref": "Runtime.RemoteObjectId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "quads",
                            "description": "Quads that describe node layout relative to viewport.",
                            "type": "array",
                            "items": {
                                "$ref": "Quad"
                            }
                        }
                    ]
                },
                {
                    "name": "getDocument",
                    "description": "Returns the root DOM node (and optionally the subtree) to the caller.",
                    "parameters": [
                        {
                            "name": "depth",
                            "description": "The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the\nentire subtree or provide an integer larger than 0.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "pierce",
                            "description": "Whether or not iframes and shadow roots should be traversed when returning the subtree\n(default is false).",
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "root",
                            "description": "Resulting node.",
                            "$ref": "Node"
                        }
                    ]
                },
                {
                    "name": "getFlattenedDocument",
                    "description": "Returns the root DOM node (and optionally the subtree) to the caller.",
                    "parameters": [
                        {
                            "name": "depth",
                            "description": "The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the\nentire subtree or provide an integer larger than 0.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "pierce",
                            "description": "Whether or not iframes and shadow roots should be traversed when returning the subtree\n(default is false).",
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "nodes",
                            "description": "Resulting node.",
                            "type": "array",
                            "items": {
                                "$ref": "Node"
                            }
                        }
                    ]
                },
                {
                    "name": "getNodeForLocation",
                    "description": "Returns node id at given location. Depending on whether DOM domain is enabled, nodeId is\neither returned or not.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "x",
                            "description": "X coordinate.",
                            "type": "integer"
                        },
                        {
                            "name": "y",
                            "description": "Y coordinate.",
                            "type": "integer"
                        },
                        {
                            "name": "includeUserAgentShadowDOM",
                            "description": "False to skip to the nearest non-UA shadow root ancestor (default: false).",
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "backendNodeId",
                            "description": "Resulting node.",
                            "$ref": "BackendNodeId"
                        },
                        {
                            "name": "nodeId",
                            "description": "Id of the node at given coordinates, only when enabled.",
                            "optional": true,
                            "$ref": "NodeId"
                        }
                    ]
                },
                {
                    "name": "getOuterHTML",
                    "description": "Returns node's HTML markup.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Identifier of the node.",
                            "optional": true,
                            "$ref": "NodeId"
                        },
                        {
                            "name": "backendNodeId",
                            "description": "Identifier of the backend node.",
                            "optional": true,
                            "$ref": "BackendNodeId"
                        },
                        {
                            "name": "objectId",
                            "description": "JavaScript object id of the node wrapper.",
                            "optional": true,
                            "$ref": "Runtime.RemoteObjectId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "outerHTML",
                            "description": "Outer HTML markup.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "getRelayoutBoundary",
                    "description": "Returns the id of the nearest ancestor that is a relayout boundary.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node.",
                            "$ref": "NodeId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "nodeId",
                            "description": "Relayout boundary node id for the given node.",
                            "$ref": "NodeId"
                        }
                    ]
                },
                {
                    "name": "getSearchResults",
                    "description": "Returns search results from given `fromIndex` to given `toIndex` from the search with the given\nidentifier.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "searchId",
                            "description": "Unique search session identifier.",
                            "type": "string"
                        },
                        {
                            "name": "fromIndex",
                            "description": "Start index of the search result to be returned.",
                            "type": "integer"
                        },
                        {
                            "name": "toIndex",
                            "description": "End index of the search result to be returned.",
                            "type": "integer"
                        }
                    ],
                    "returns": [
                        {
                            "name": "nodeIds",
                            "description": "Ids of the search result nodes.",
                            "type": "array",
                            "items": {
                                "$ref": "NodeId"
                            }
                        }
                    ]
                },
                {
                    "name": "hideHighlight",
                    "description": "Hides any highlight.",
                    "redirect": "Overlay"
                },
                {
                    "name": "highlightNode",
                    "description": "Highlights DOM node.",
                    "redirect": "Overlay"
                },
                {
                    "name": "highlightRect",
                    "description": "Highlights given rectangle.",
                    "redirect": "Overlay"
                },
                {
                    "name": "markUndoableState",
                    "description": "Marks last undoable state.",
                    "experimental": true
                },
                {
                    "name": "moveTo",
                    "description": "Moves node into the new container, places it before the given anchor.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node to move.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "targetNodeId",
                            "description": "Id of the element to drop the moved node into.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "insertBeforeNodeId",
                            "description": "Drop node before this one (if absent, the moved node becomes the last child of\n`targetNodeId`).",
                            "optional": true,
                            "$ref": "NodeId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "nodeId",
                            "description": "New id of the moved node.",
                            "$ref": "NodeId"
                        }
                    ]
                },
                {
                    "name": "performSearch",
                    "description": "Searches for a given string in the DOM tree. Use `getSearchResults` to access search results or\n`cancelSearch` to end this search session.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "query",
                            "description": "Plain text or query selector or XPath search query.",
                            "type": "string"
                        },
                        {
                            "name": "includeUserAgentShadowDOM",
                            "description": "True to search in user agent shadow DOM.",
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "searchId",
                            "description": "Unique search session identifier.",
                            "type": "string"
                        },
                        {
                            "name": "resultCount",
                            "description": "Number of search results.",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "name": "pushNodeByPathToFrontend",
                    "description": "Requests that the node is sent to the caller given its path. // FIXME, use XPath",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "path",
                            "description": "Path to node in the proprietary format.",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node for given path.",
                            "$ref": "NodeId"
                        }
                    ]
                },
                {
                    "name": "pushNodesByBackendIdsToFrontend",
                    "description": "Requests that a batch of nodes is sent to the caller given their backend node ids.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "backendNodeIds",
                            "description": "The array of backend node ids.",
                            "type": "array",
                            "items": {
                                "$ref": "BackendNodeId"
                            }
                        }
                    ],
                    "returns": [
                        {
                            "name": "nodeIds",
                            "description": "The array of ids of pushed nodes that correspond to the backend ids specified in\nbackendNodeIds.",
                            "type": "array",
                            "items": {
                                "$ref": "NodeId"
                            }
                        }
                    ]
                },
                {
                    "name": "querySelector",
                    "description": "Executes `querySelector` on a given node.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node to query upon.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "selector",
                            "description": "Selector string.",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "nodeId",
                            "description": "Query selector result.",
                            "$ref": "NodeId"
                        }
                    ]
                },
                {
                    "name": "querySelectorAll",
                    "description": "Executes `querySelectorAll` on a given node.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node to query upon.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "selector",
                            "description": "Selector string.",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "nodeIds",
                            "description": "Query selector result.",
                            "type": "array",
                            "items": {
                                "$ref": "NodeId"
                            }
                        }
                    ]
                },
                {
                    "name": "redo",
                    "description": "Re-does the last undone action.",
                    "experimental": true
                },
                {
                    "name": "removeAttribute",
                    "description": "Removes attribute with given name from an element with given id.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the element to remove attribute from.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "name",
                            "description": "Name of the attribute to remove.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "removeNode",
                    "description": "Removes node with given id.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node to remove.",
                            "$ref": "NodeId"
                        }
                    ]
                },
                {
                    "name": "requestChildNodes",
                    "description": "Requests that children of the node with given id are returned to the caller in form of\n`setChildNodes` events where not only immediate children are retrieved, but all children down to\nthe specified depth.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node to get children for.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "depth",
                            "description": "The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the\nentire subtree or provide an integer larger than 0.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "pierce",
                            "description": "Whether or not iframes and shadow roots should be traversed when returning the sub-tree\n(default is false).",
                            "optional": true,
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "requestNode",
                    "description": "Requests that the node is sent to the caller given the JavaScript node object reference. All\nnodes that form the path from the node to the root are also sent to the client as a series of\n`setChildNodes` notifications.",
                    "parameters": [
                        {
                            "name": "objectId",
                            "description": "JavaScript object id to convert into node.",
                            "$ref": "Runtime.RemoteObjectId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "nodeId",
                            "description": "Node id for given object.",
                            "$ref": "NodeId"
                        }
                    ]
                },
                {
                    "name": "resolveNode",
                    "description": "Resolves the JavaScript node object for a given NodeId or BackendNodeId.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node to resolve.",
                            "optional": true,
                            "$ref": "NodeId"
                        },
                        {
                            "name": "backendNodeId",
                            "description": "Backend identifier of the node to resolve.",
                            "optional": true,
                            "$ref": "DOM.BackendNodeId"
                        },
                        {
                            "name": "objectGroup",
                            "description": "Symbolic group name that can be used to release multiple objects.",
                            "optional": true,
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "object",
                            "description": "JavaScript object wrapper for given node.",
                            "$ref": "Runtime.RemoteObject"
                        }
                    ]
                },
                {
                    "name": "setAttributeValue",
                    "description": "Sets attribute for an element with given id.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the element to set attribute for.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "name",
                            "description": "Attribute name.",
                            "type": "string"
                        },
                        {
                            "name": "value",
                            "description": "Attribute value.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "setAttributesAsText",
                    "description": "Sets attributes on element with given id. This method is useful when user edits some existing\nattribute value and types in several attribute name/value pairs.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the element to set attributes for.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "text",
                            "description": "Text with a number of attributes. Will parse this text using HTML parser.",
                            "type": "string"
                        },
                        {
                            "name": "name",
                            "description": "Attribute name to replace with new attributes derived from text in case text parsed\nsuccessfully.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "setFileInputFiles",
                    "description": "Sets files for the given file input element.",
                    "parameters": [
                        {
                            "name": "files",
                            "description": "Array of file paths to set.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "nodeId",
                            "description": "Identifier of the node.",
                            "optional": true,
                            "$ref": "NodeId"
                        },
                        {
                            "name": "backendNodeId",
                            "description": "Identifier of the backend node.",
                            "optional": true,
                            "$ref": "BackendNodeId"
                        },
                        {
                            "name": "objectId",
                            "description": "JavaScript object id of the node wrapper.",
                            "optional": true,
                            "$ref": "Runtime.RemoteObjectId"
                        }
                    ]
                },
                {
                    "name": "setInspectedNode",
                    "description": "Enables console to refer to the node with given id via $x (see Command Line API for more details\n$x functions).",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "DOM node id to be accessible by means of $x command line API.",
                            "$ref": "NodeId"
                        }
                    ]
                },
                {
                    "name": "setNodeName",
                    "description": "Sets node name for a node with given id.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node to set name for.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "name",
                            "description": "New node's name.",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "nodeId",
                            "description": "New node's id.",
                            "$ref": "NodeId"
                        }
                    ]
                },
                {
                    "name": "setNodeValue",
                    "description": "Sets node value for a node with given id.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node to set value for.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "value",
                            "description": "New node's value.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "setOuterHTML",
                    "description": "Sets node HTML markup, returns new node id.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node to set markup for.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "outerHTML",
                            "description": "Outer HTML markup to set.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "undo",
                    "description": "Undoes the last performed action.",
                    "experimental": true
                },
                {
                    "name": "getFrameOwner",
                    "description": "Returns iframe node that owns iframe with the given domain.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "frameId",
                            "$ref": "Page.FrameId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "backendNodeId",
                            "description": "Resulting node.",
                            "$ref": "BackendNodeId"
                        },
                        {
                            "name": "nodeId",
                            "description": "Id of the node at given coordinates, only when enabled.",
                            "optional": true,
                            "$ref": "NodeId"
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "attributeModified",
                    "description": "Fired when `Element`'s attribute is modified.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node that has changed.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "name",
                            "description": "Attribute name.",
                            "type": "string"
                        },
                        {
                            "name": "value",
                            "description": "Attribute value.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "attributeRemoved",
                    "description": "Fired when `Element`'s attribute is removed.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node that has changed.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "name",
                            "description": "A ttribute name.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "characterDataModified",
                    "description": "Mirrors `DOMCharacterDataModified` event.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node that has changed.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "characterData",
                            "description": "New text value.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "childNodeCountUpdated",
                    "description": "Fired when `Container`'s child node count has changed.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node that has changed.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "childNodeCount",
                            "description": "New node count.",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "name": "childNodeInserted",
                    "description": "Mirrors `DOMNodeInserted` event.",
                    "parameters": [
                        {
                            "name": "parentNodeId",
                            "description": "Id of the node that has changed.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "previousNodeId",
                            "description": "If of the previous siblint.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "node",
                            "description": "Inserted node data.",
                            "$ref": "Node"
                        }
                    ]
                },
                {
                    "name": "childNodeRemoved",
                    "description": "Mirrors `DOMNodeRemoved` event.",
                    "parameters": [
                        {
                            "name": "parentNodeId",
                            "description": "Parent id.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "nodeId",
                            "description": "Id of the node that has been removed.",
                            "$ref": "NodeId"
                        }
                    ]
                },
                {
                    "name": "distributedNodesUpdated",
                    "description": "Called when distrubution is changed.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "insertionPointId",
                            "description": "Insertion point where distrubuted nodes were updated.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "distributedNodes",
                            "description": "Distributed nodes for given insertion point.",
                            "type": "array",
                            "items": {
                                "$ref": "BackendNode"
                            }
                        }
                    ]
                },
                {
                    "name": "documentUpdated",
                    "description": "Fired when `Document` has been totally updated. Node ids are no longer valid."
                },
                {
                    "name": "inlineStyleInvalidated",
                    "description": "Fired when `Element`'s inline style is modified via a CSS property modification.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "nodeIds",
                            "description": "Ids of the nodes for which the inline styles have been invalidated.",
                            "type": "array",
                            "items": {
                                "$ref": "NodeId"
                            }
                        }
                    ]
                },
                {
                    "name": "pseudoElementAdded",
                    "description": "Called when a pseudo element is added to an element.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "parentId",
                            "description": "Pseudo element's parent element id.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "pseudoElement",
                            "description": "The added pseudo element.",
                            "$ref": "Node"
                        }
                    ]
                },
                {
                    "name": "pseudoElementRemoved",
                    "description": "Called when a pseudo element is removed from an element.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "parentId",
                            "description": "Pseudo element's parent element id.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "pseudoElementId",
                            "description": "The removed pseudo element id.",
                            "$ref": "NodeId"
                        }
                    ]
                },
                {
                    "name": "setChildNodes",
                    "description": "Fired when backend wants to provide client with the missing DOM structure. This happens upon\nmost of the calls requesting node ids.",
                    "parameters": [
                        {
                            "name": "parentId",
                            "description": "Parent node id to populate with children.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "nodes",
                            "description": "Child nodes array.",
                            "type": "array",
                            "items": {
                                "$ref": "Node"
                            }
                        }
                    ]
                },
                {
                    "name": "shadowRootPopped",
                    "description": "Called when shadow root is popped from the element.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "hostId",
                            "description": "Host element id.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "rootId",
                            "description": "Shadow root id.",
                            "$ref": "NodeId"
                        }
                    ]
                },
                {
                    "name": "shadowRootPushed",
                    "description": "Called when shadow root is pushed into the element.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "hostId",
                            "description": "Host element id.",
                            "$ref": "NodeId"
                        },
                        {
                            "name": "root",
                            "description": "Shadow root.",
                            "$ref": "Node"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "DOMDebugger",
            "description": "DOM debugging allows setting breakpoints on particular DOM operations and events. JavaScript\nexecution will stop on these operations as if there was a regular breakpoint set.",
            "dependencies": [
                "DOM",
                "Debugger",
                "Runtime"
            ],
            "types": [
                {
                    "id": "DOMBreakpointType",
                    "description": "DOM breakpoint type.",
                    "type": "string",
                    "enum": [
                        "subtree-modified",
                        "attribute-modified",
                        "node-removed"
                    ]
                },
                {
                    "id": "EventListener",
                    "description": "Object event listener.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "type",
                            "description": "`EventListener`'s type.",
                            "type": "string"
                        },
                        {
                            "name": "useCapture",
                            "description": "`EventListener`'s useCapture.",
                            "type": "boolean"
                        },
                        {
                            "name": "passive",
                            "description": "`EventListener`'s passive flag.",
                            "type": "boolean"
                        },
                        {
                            "name": "once",
                            "description": "`EventListener`'s once flag.",
                            "type": "boolean"
                        },
                        {
                            "name": "scriptId",
                            "description": "Script id of the handler code.",
                            "$ref": "Runtime.ScriptId"
                        },
                        {
                            "name": "lineNumber",
                            "description": "Line number in the script (0-based).",
                            "type": "integer"
                        },
                        {
                            "name": "columnNumber",
                            "description": "Column number in the script (0-based).",
                            "type": "integer"
                        },
                        {
                            "name": "handler",
                            "description": "Event handler function value.",
                            "optional": true,
                            "$ref": "Runtime.RemoteObject"
                        },
                        {
                            "name": "originalHandler",
                            "description": "Event original handler function value.",
                            "optional": true,
                            "$ref": "Runtime.RemoteObject"
                        },
                        {
                            "name": "backendNodeId",
                            "description": "Node the listener is added to (if any).",
                            "optional": true,
                            "$ref": "DOM.BackendNodeId"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "getEventListeners",
                    "description": "Returns event listeners of the given object.",
                    "parameters": [
                        {
                            "name": "objectId",
                            "description": "Identifier of the object to return listeners for.",
                            "$ref": "Runtime.RemoteObjectId"
                        },
                        {
                            "name": "depth",
                            "description": "The maximum depth at which Node children should be retrieved, defaults to 1. Use -1 for the\nentire subtree or provide an integer larger than 0.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "pierce",
                            "description": "Whether or not iframes and shadow roots should be traversed when returning the subtree\n(default is false). Reports listeners for all contexts if pierce is enabled.",
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "listeners",
                            "description": "Array of relevant listeners.",
                            "type": "array",
                            "items": {
                                "$ref": "EventListener"
                            }
                        }
                    ]
                },
                {
                    "name": "removeDOMBreakpoint",
                    "description": "Removes DOM breakpoint that was set using `setDOMBreakpoint`.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Identifier of the node to remove breakpoint from.",
                            "$ref": "DOM.NodeId"
                        },
                        {
                            "name": "type",
                            "description": "Type of the breakpoint to remove.",
                            "$ref": "DOMBreakpointType"
                        }
                    ]
                },
                {
                    "name": "removeEventListenerBreakpoint",
                    "description": "Removes breakpoint on particular DOM event.",
                    "parameters": [
                        {
                            "name": "eventName",
                            "description": "Event name.",
                            "type": "string"
                        },
                        {
                            "name": "targetName",
                            "description": "EventTarget interface name.",
                            "experimental": true,
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "removeInstrumentationBreakpoint",
                    "description": "Removes breakpoint on particular native event.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "eventName",
                            "description": "Instrumentation name to stop on.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "removeXHRBreakpoint",
                    "description": "Removes breakpoint from XMLHttpRequest.",
                    "parameters": [
                        {
                            "name": "url",
                            "description": "Resource URL substring.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "setDOMBreakpoint",
                    "description": "Sets breakpoint on particular operation with DOM.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Identifier of the node to set breakpoint on.",
                            "$ref": "DOM.NodeId"
                        },
                        {
                            "name": "type",
                            "description": "Type of the operation to stop upon.",
                            "$ref": "DOMBreakpointType"
                        }
                    ]
                },
                {
                    "name": "setEventListenerBreakpoint",
                    "description": "Sets breakpoint on particular DOM event.",
                    "parameters": [
                        {
                            "name": "eventName",
                            "description": "DOM Event name to stop on (any DOM event will do).",
                            "type": "string"
                        },
                        {
                            "name": "targetName",
                            "description": "EventTarget interface name to stop on. If equal to `\"*\"` or not provided, will stop on any\nEventTarget.",
                            "experimental": true,
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "setInstrumentationBreakpoint",
                    "description": "Sets breakpoint on particular native event.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "eventName",
                            "description": "Instrumentation name to stop on.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "setXHRBreakpoint",
                    "description": "Sets breakpoint on XMLHttpRequest.",
                    "parameters": [
                        {
                            "name": "url",
                            "description": "Resource URL substring. All XHRs having this substring in the URL will get stopped upon.",
                            "type": "string"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "DOMSnapshot",
            "description": "This domain facilitates obtaining document snapshots with DOM, layout, and style information.",
            "experimental": true,
            "dependencies": [
                "CSS",
                "DOM",
                "DOMDebugger",
                "Page"
            ],
            "types": [
                {
                    "id": "DOMNode",
                    "description": "A Node in the DOM tree.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "nodeType",
                            "description": "`Node`'s nodeType.",
                            "type": "integer"
                        },
                        {
                            "name": "nodeName",
                            "description": "`Node`'s nodeName.",
                            "type": "string"
                        },
                        {
                            "name": "nodeValue",
                            "description": "`Node`'s nodeValue.",
                            "type": "string"
                        },
                        {
                            "name": "textValue",
                            "description": "Only set for textarea elements, contains the text value.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "inputValue",
                            "description": "Only set for input elements, contains the input's associated text value.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "inputChecked",
                            "description": "Only set for radio and checkbox input elements, indicates if the element has been checked",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "optionSelected",
                            "description": "Only set for option elements, indicates if the element has been selected",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "backendNodeId",
                            "description": "`Node`'s id, corresponds to DOM.Node.backendNodeId.",
                            "$ref": "DOM.BackendNodeId"
                        },
                        {
                            "name": "childNodeIndexes",
                            "description": "The indexes of the node's child nodes in the `domNodes` array returned by `getSnapshot`, if\nany.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        {
                            "name": "attributes",
                            "description": "Attributes of an `Element` node.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "NameValue"
                            }
                        },
                        {
                            "name": "pseudoElementIndexes",
                            "description": "Indexes of pseudo elements associated with this node in the `domNodes` array returned by\n`getSnapshot`, if any.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        {
                            "name": "layoutNodeIndex",
                            "description": "The index of the node's related layout tree node in the `layoutTreeNodes` array returned by\n`getSnapshot`, if any.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "documentURL",
                            "description": "Document URL that `Document` or `FrameOwner` node points to.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "baseURL",
                            "description": "Base URL that `Document` or `FrameOwner` node uses for URL completion.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "contentLanguage",
                            "description": "Only set for documents, contains the document's content language.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "documentEncoding",
                            "description": "Only set for documents, contains the document's character set encoding.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "publicId",
                            "description": "`DocumentType` node's publicId.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "systemId",
                            "description": "`DocumentType` node's systemId.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "frameId",
                            "description": "Frame ID for frame owner elements and also for the document node.",
                            "optional": true,
                            "$ref": "Page.FrameId"
                        },
                        {
                            "name": "contentDocumentIndex",
                            "description": "The index of a frame owner element's content document in the `domNodes` array returned by\n`getSnapshot`, if any.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "pseudoType",
                            "description": "Type of a pseudo element node.",
                            "optional": true,
                            "$ref": "DOM.PseudoType"
                        },
                        {
                            "name": "shadowRootType",
                            "description": "Shadow root type.",
                            "optional": true,
                            "$ref": "DOM.ShadowRootType"
                        },
                        {
                            "name": "isClickable",
                            "description": "Whether this DOM node responds to mouse clicks. This includes nodes that have had click\nevent listeners attached via JavaScript as well as anchor tags that naturally navigate when\nclicked.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "eventListeners",
                            "description": "Details of the node's event listeners, if any.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "DOMDebugger.EventListener"
                            }
                        },
                        {
                            "name": "currentSourceURL",
                            "description": "The selected url for nodes with a srcset attribute.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "originURL",
                            "description": "The url of the script (if any) that generates this node.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "scrollOffsetX",
                            "description": "Scroll offsets, set when this node is a Document.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "scrollOffsetY",
                            "optional": true,
                            "type": "number"
                        }
                    ]
                },
                {
                    "id": "InlineTextBox",
                    "description": "Details of post layout rendered text positions. The exact layout should not be regarded as\nstable and may change between versions.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "boundingBox",
                            "description": "The bounding box in document coordinates. Note that scroll offset of the document is ignored.",
                            "$ref": "DOM.Rect"
                        },
                        {
                            "name": "startCharacterIndex",
                            "description": "The starting index in characters, for this post layout textbox substring. Characters that\nwould be represented as a surrogate pair in UTF-16 have length 2.",
                            "type": "integer"
                        },
                        {
                            "name": "numCharacters",
                            "description": "The number of characters in this post layout textbox substring. Characters that would be\nrepresented as a surrogate pair in UTF-16 have length 2.",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "id": "LayoutTreeNode",
                    "description": "Details of an element in the DOM tree with a LayoutObject.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "domNodeIndex",
                            "description": "The index of the related DOM node in the `domNodes` array returned by `getSnapshot`.",
                            "type": "integer"
                        },
                        {
                            "name": "boundingBox",
                            "description": "The bounding box in document coordinates. Note that scroll offset of the document is ignored.",
                            "$ref": "DOM.Rect"
                        },
                        {
                            "name": "layoutText",
                            "description": "Contents of the LayoutText, if any.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "inlineTextNodes",
                            "description": "The post-layout inline text nodes, if any.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "InlineTextBox"
                            }
                        },
                        {
                            "name": "styleIndex",
                            "description": "Index into the `computedStyles` array returned by `getSnapshot`.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "paintOrder",
                            "description": "Global paint order index, which is determined by the stacking order of the nodes. Nodes\nthat are painted together will have the same index. Only provided if includePaintOrder in\ngetSnapshot was true.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "isStackingContext",
                            "description": "Set to true to indicate the element begins a new stacking context.",
                            "optional": true,
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "id": "ComputedStyle",
                    "description": "A subset of the full ComputedStyle as defined by the request whitelist.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "properties",
                            "description": "Name/value pairs of computed style properties.",
                            "type": "array",
                            "items": {
                                "$ref": "NameValue"
                            }
                        }
                    ]
                },
                {
                    "id": "NameValue",
                    "description": "A name/value pair.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "name",
                            "description": "Attribute/property name.",
                            "type": "string"
                        },
                        {
                            "name": "value",
                            "description": "Attribute/property value.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "StringIndex",
                    "description": "Index of the string in the strings table.",
                    "type": "integer"
                },
                {
                    "id": "ArrayOfStrings",
                    "description": "Index of the string in the strings table.",
                    "type": "array",
                    "items": {
                        "$ref": "StringIndex"
                    }
                },
                {
                    "id": "RareStringData",
                    "description": "Data that is only present on rare nodes.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "index",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        {
                            "name": "value",
                            "type": "array",
                            "items": {
                                "$ref": "StringIndex"
                            }
                        }
                    ]
                },
                {
                    "id": "RareBooleanData",
                    "type": "object",
                    "properties": [
                        {
                            "name": "index",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        }
                    ]
                },
                {
                    "id": "RareIntegerData",
                    "type": "object",
                    "properties": [
                        {
                            "name": "index",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        {
                            "name": "value",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        }
                    ]
                },
                {
                    "id": "Rectangle",
                    "type": "array",
                    "items": {
                        "type": "number"
                    }
                },
                {
                    "id": "DocumentSnapshot",
                    "description": "Document snapshot.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "documentURL",
                            "description": "Document URL that `Document` or `FrameOwner` node points to.",
                            "$ref": "StringIndex"
                        },
                        {
                            "name": "baseURL",
                            "description": "Base URL that `Document` or `FrameOwner` node uses for URL completion.",
                            "$ref": "StringIndex"
                        },
                        {
                            "name": "contentLanguage",
                            "description": "Contains the document's content language.",
                            "$ref": "StringIndex"
                        },
                        {
                            "name": "encodingName",
                            "description": "Contains the document's character set encoding.",
                            "$ref": "StringIndex"
                        },
                        {
                            "name": "publicId",
                            "description": "`DocumentType` node's publicId.",
                            "$ref": "StringIndex"
                        },
                        {
                            "name": "systemId",
                            "description": "`DocumentType` node's systemId.",
                            "$ref": "StringIndex"
                        },
                        {
                            "name": "frameId",
                            "description": "Frame ID for frame owner elements and also for the document node.",
                            "$ref": "StringIndex"
                        },
                        {
                            "name": "nodes",
                            "description": "A table with dom nodes.",
                            "$ref": "NodeTreeSnapshot"
                        },
                        {
                            "name": "layout",
                            "description": "The nodes in the layout tree.",
                            "$ref": "LayoutTreeSnapshot"
                        },
                        {
                            "name": "textBoxes",
                            "description": "The post-layout inline text nodes.",
                            "$ref": "TextBoxSnapshot"
                        },
                        {
                            "name": "scrollOffsetX",
                            "description": "Scroll offsets.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "scrollOffsetY",
                            "optional": true,
                            "type": "number"
                        }
                    ]
                },
                {
                    "id": "NodeTreeSnapshot",
                    "description": "Table containing nodes.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "parentIndex",
                            "description": "Parent node index.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        {
                            "name": "nodeType",
                            "description": "`Node`'s nodeType.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        {
                            "name": "nodeName",
                            "description": "`Node`'s nodeName.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "StringIndex"
                            }
                        },
                        {
                            "name": "nodeValue",
                            "description": "`Node`'s nodeValue.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "StringIndex"
                            }
                        },
                        {
                            "name": "backendNodeId",
                            "description": "`Node`'s id, corresponds to DOM.Node.backendNodeId.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "DOM.BackendNodeId"
                            }
                        },
                        {
                            "name": "attributes",
                            "description": "Attributes of an `Element` node. Flatten name, value pairs.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "ArrayOfStrings"
                            }
                        },
                        {
                            "name": "textValue",
                            "description": "Only set for textarea elements, contains the text value.",
                            "optional": true,
                            "$ref": "RareStringData"
                        },
                        {
                            "name": "inputValue",
                            "description": "Only set for input elements, contains the input's associated text value.",
                            "optional": true,
                            "$ref": "RareStringData"
                        },
                        {
                            "name": "inputChecked",
                            "description": "Only set for radio and checkbox input elements, indicates if the element has been checked",
                            "optional": true,
                            "$ref": "RareBooleanData"
                        },
                        {
                            "name": "optionSelected",
                            "description": "Only set for option elements, indicates if the element has been selected",
                            "optional": true,
                            "$ref": "RareBooleanData"
                        },
                        {
                            "name": "contentDocumentIndex",
                            "description": "The index of the document in the list of the snapshot documents.",
                            "optional": true,
                            "$ref": "RareIntegerData"
                        },
                        {
                            "name": "pseudoType",
                            "description": "Type of a pseudo element node.",
                            "optional": true,
                            "$ref": "RareStringData"
                        },
                        {
                            "name": "isClickable",
                            "description": "Whether this DOM node responds to mouse clicks. This includes nodes that have had click\nevent listeners attached via JavaScript as well as anchor tags that naturally navigate when\nclicked.",
                            "optional": true,
                            "$ref": "RareBooleanData"
                        },
                        {
                            "name": "currentSourceURL",
                            "description": "The selected url for nodes with a srcset attribute.",
                            "optional": true,
                            "$ref": "RareStringData"
                        },
                        {
                            "name": "originURL",
                            "description": "The url of the script (if any) that generates this node.",
                            "optional": true,
                            "$ref": "RareStringData"
                        }
                    ]
                },
                {
                    "id": "LayoutTreeSnapshot",
                    "description": "Details of an element in the DOM tree with a LayoutObject.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "nodeIndex",
                            "description": "The index of the related DOM node in the `domNodes` array returned by `getSnapshot`.",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        {
                            "name": "styles",
                            "description": "Index into the `computedStyles` array returned by `captureSnapshot`.",
                            "type": "array",
                            "items": {
                                "$ref": "ArrayOfStrings"
                            }
                        },
                        {
                            "name": "bounds",
                            "description": "The absolute position bounding box.",
                            "type": "array",
                            "items": {
                                "$ref": "Rectangle"
                            }
                        },
                        {
                            "name": "text",
                            "description": "Contents of the LayoutText, if any.",
                            "type": "array",
                            "items": {
                                "$ref": "StringIndex"
                            }
                        },
                        {
                            "name": "stackingContexts",
                            "description": "Stacking context information.",
                            "$ref": "RareBooleanData"
                        }
                    ]
                },
                {
                    "id": "TextBoxSnapshot",
                    "description": "Details of post layout rendered text positions. The exact layout should not be regarded as\nstable and may change between versions.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "layoutIndex",
                            "description": "Intex of th elayout tree node that owns this box collection.",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        {
                            "name": "bounds",
                            "description": "The absolute position bounding box.",
                            "type": "array",
                            "items": {
                                "$ref": "Rectangle"
                            }
                        },
                        {
                            "name": "start",
                            "description": "The starting index in characters, for this post layout textbox substring. Characters that\nwould be represented as a surrogate pair in UTF-16 have length 2.",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        {
                            "name": "length",
                            "description": "The number of characters in this post layout textbox substring. Characters that would be\nrepresented as a surrogate pair in UTF-16 have length 2.",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "disable",
                    "description": "Disables DOM snapshot agent for the given page."
                },
                {
                    "name": "enable",
                    "description": "Enables DOM snapshot agent for the given page."
                },
                {
                    "name": "getSnapshot",
                    "description": "Returns a document snapshot, including the full DOM tree of the root node (including iframes,\ntemplate contents, and imported documents) in a flattened array, as well as layout and\nwhite-listed computed style information for the nodes. Shadow DOM in the returned DOM tree is\nflattened.",
                    "deprecated": true,
                    "parameters": [
                        {
                            "name": "computedStyleWhitelist",
                            "description": "Whitelist of computed styles to return.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "includeEventListeners",
                            "description": "Whether or not to retrieve details of DOM listeners (default false).",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "includePaintOrder",
                            "description": "Whether to determine and include the paint order index of LayoutTreeNodes (default false).",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "includeUserAgentShadowTree",
                            "description": "Whether to include UA shadow tree in the snapshot (default false).",
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "domNodes",
                            "description": "The nodes in the DOM tree. The DOMNode at index 0 corresponds to the root document.",
                            "type": "array",
                            "items": {
                                "$ref": "DOMNode"
                            }
                        },
                        {
                            "name": "layoutTreeNodes",
                            "description": "The nodes in the layout tree.",
                            "type": "array",
                            "items": {
                                "$ref": "LayoutTreeNode"
                            }
                        },
                        {
                            "name": "computedStyles",
                            "description": "Whitelisted ComputedStyle properties for each node in the layout tree.",
                            "type": "array",
                            "items": {
                                "$ref": "ComputedStyle"
                            }
                        }
                    ]
                },
                {
                    "name": "captureSnapshot",
                    "description": "Returns a document snapshot, including the full DOM tree of the root node (including iframes,\ntemplate contents, and imported documents) in a flattened array, as well as layout and\nwhite-listed computed style information for the nodes. Shadow DOM in the returned DOM tree is\nflattened.",
                    "parameters": [
                        {
                            "name": "computedStyles",
                            "description": "Whitelist of computed styles to return.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ],
                    "returns": [
                        {
                            "name": "documents",
                            "description": "The nodes in the DOM tree. The DOMNode at index 0 corresponds to the root document.",
                            "type": "array",
                            "items": {
                                "$ref": "DocumentSnapshot"
                            }
                        },
                        {
                            "name": "strings",
                            "description": "Shared string table that all string properties refer to with indexes.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "domain": "DOMStorage",
            "description": "Query and modify DOM storage.",
            "experimental": true,
            "types": [
                {
                    "id": "StorageId",
                    "description": "DOM Storage identifier.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "securityOrigin",
                            "description": "Security origin for the storage.",
                            "type": "string"
                        },
                        {
                            "name": "isLocalStorage",
                            "description": "Whether the storage is local storage (not session storage).",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "id": "Item",
                    "description": "DOM Storage item.",
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            ],
            "commands": [
                {
                    "name": "clear",
                    "parameters": [
                        {
                            "name": "storageId",
                            "$ref": "StorageId"
                        }
                    ]
                },
                {
                    "name": "disable",
                    "description": "Disables storage tracking, prevents storage events from being sent to the client."
                },
                {
                    "name": "enable",
                    "description": "Enables storage tracking, storage events will now be delivered to the client."
                },
                {
                    "name": "getDOMStorageItems",
                    "parameters": [
                        {
                            "name": "storageId",
                            "$ref": "StorageId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "entries",
                            "type": "array",
                            "items": {
                                "$ref": "Item"
                            }
                        }
                    ]
                },
                {
                    "name": "removeDOMStorageItem",
                    "parameters": [
                        {
                            "name": "storageId",
                            "$ref": "StorageId"
                        },
                        {
                            "name": "key",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "setDOMStorageItem",
                    "parameters": [
                        {
                            "name": "storageId",
                            "$ref": "StorageId"
                        },
                        {
                            "name": "key",
                            "type": "string"
                        },
                        {
                            "name": "value",
                            "type": "string"
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "domStorageItemAdded",
                    "parameters": [
                        {
                            "name": "storageId",
                            "$ref": "StorageId"
                        },
                        {
                            "name": "key",
                            "type": "string"
                        },
                        {
                            "name": "newValue",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "domStorageItemRemoved",
                    "parameters": [
                        {
                            "name": "storageId",
                            "$ref": "StorageId"
                        },
                        {
                            "name": "key",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "domStorageItemUpdated",
                    "parameters": [
                        {
                            "name": "storageId",
                            "$ref": "StorageId"
                        },
                        {
                            "name": "key",
                            "type": "string"
                        },
                        {
                            "name": "oldValue",
                            "type": "string"
                        },
                        {
                            "name": "newValue",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "domStorageItemsCleared",
                    "parameters": [
                        {
                            "name": "storageId",
                            "$ref": "StorageId"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Database",
            "experimental": true,
            "types": [
                {
                    "id": "DatabaseId",
                    "description": "Unique identifier of Database object.",
                    "type": "string"
                },
                {
                    "id": "Database",
                    "description": "Database object.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "id",
                            "description": "Database ID.",
                            "$ref": "DatabaseId"
                        },
                        {
                            "name": "domain",
                            "description": "Database domain.",
                            "type": "string"
                        },
                        {
                            "name": "name",
                            "description": "Database name.",
                            "type": "string"
                        },
                        {
                            "name": "version",
                            "description": "Database version.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "Error",
                    "description": "Database error.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "message",
                            "description": "Error message.",
                            "type": "string"
                        },
                        {
                            "name": "code",
                            "description": "Error code.",
                            "type": "integer"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "disable",
                    "description": "Disables database tracking, prevents database events from being sent to the client."
                },
                {
                    "name": "enable",
                    "description": "Enables database tracking, database events will now be delivered to the client."
                },
                {
                    "name": "executeSQL",
                    "parameters": [
                        {
                            "name": "databaseId",
                            "$ref": "DatabaseId"
                        },
                        {
                            "name": "query",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "columnNames",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "values",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "type": "any"
                            }
                        },
                        {
                            "name": "sqlError",
                            "optional": true,
                            "$ref": "Error"
                        }
                    ]
                },
                {
                    "name": "getDatabaseTableNames",
                    "parameters": [
                        {
                            "name": "databaseId",
                            "$ref": "DatabaseId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "tableNames",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "addDatabase",
                    "parameters": [
                        {
                            "name": "database",
                            "$ref": "Database"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "DeviceOrientation",
            "experimental": true,
            "commands": [
                {
                    "name": "clearDeviceOrientationOverride",
                    "description": "Clears the overridden Device Orientation."
                },
                {
                    "name": "setDeviceOrientationOverride",
                    "description": "Overrides the Device Orientation.",
                    "parameters": [
                        {
                            "name": "alpha",
                            "description": "Mock alpha",
                            "type": "number"
                        },
                        {
                            "name": "beta",
                            "description": "Mock beta",
                            "type": "number"
                        },
                        {
                            "name": "gamma",
                            "description": "Mock gamma",
                            "type": "number"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Emulation",
            "description": "This domain emulates different environments for the page.",
            "dependencies": [
                "DOM",
                "Page",
                "Runtime"
            ],
            "types": [
                {
                    "id": "ScreenOrientation",
                    "description": "Screen orientation.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "type",
                            "description": "Orientation type.",
                            "type": "string",
                            "enum": [
                                "portraitPrimary",
                                "portraitSecondary",
                                "landscapePrimary",
                                "landscapeSecondary"
                            ]
                        },
                        {
                            "name": "angle",
                            "description": "Orientation angle.",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "id": "VirtualTimePolicy",
                    "description": "advance: If the scheduler runs out of immediate work, the virtual time base may fast forward to\nallow the next delayed task (if any) to run; pause: The virtual time base may not advance;\npauseIfNetworkFetchesPending: The virtual time base may not advance if there are any pending\nresource fetches.",
                    "experimental": true,
                    "type": "string",
                    "enum": [
                        "advance",
                        "pause",
                        "pauseIfNetworkFetchesPending"
                    ]
                }
            ],
            "commands": [
                {
                    "name": "canEmulate",
                    "description": "Tells whether emulation is supported.",
                    "returns": [
                        {
                            "name": "result",
                            "description": "True if emulation is supported.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "clearDeviceMetricsOverride",
                    "description": "Clears the overriden device metrics."
                },
                {
                    "name": "clearGeolocationOverride",
                    "description": "Clears the overriden Geolocation Position and Error."
                },
                {
                    "name": "resetPageScaleFactor",
                    "description": "Requests that page scale factor is reset to initial values.",
                    "experimental": true
                },
                {
                    "name": "setFocusEmulationEnabled",
                    "description": "Enables or disables simulating a focused and active page.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "enabled",
                            "description": "Whether to enable to disable focus emulation.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setCPUThrottlingRate",
                    "description": "Enables CPU throttling to emulate slow CPUs.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "rate",
                            "description": "Throttling rate as a slowdown factor (1 is no throttle, 2 is 2x slowdown, etc).",
                            "type": "number"
                        }
                    ]
                },
                {
                    "name": "setDefaultBackgroundColorOverride",
                    "description": "Sets or clears an override of the default background color of the frame. This override is used\nif the content does not specify one.",
                    "parameters": [
                        {
                            "name": "color",
                            "description": "RGBA of the default background color. If not specified, any existing override will be\ncleared.",
                            "optional": true,
                            "$ref": "DOM.RGBA"
                        }
                    ]
                },
                {
                    "name": "setDeviceMetricsOverride",
                    "description": "Overrides the values of device screen dimensions (window.screen.width, window.screen.height,\nwindow.innerWidth, window.innerHeight, and \"device-width\"/\"device-height\"-related CSS media\nquery results).",
                    "parameters": [
                        {
                            "name": "width",
                            "description": "Overriding width value in pixels (minimum 0, maximum 10000000). 0 disables the override.",
                            "type": "integer"
                        },
                        {
                            "name": "height",
                            "description": "Overriding height value in pixels (minimum 0, maximum 10000000). 0 disables the override.",
                            "type": "integer"
                        },
                        {
                            "name": "deviceScaleFactor",
                            "description": "Overriding device scale factor value. 0 disables the override.",
                            "type": "number"
                        },
                        {
                            "name": "mobile",
                            "description": "Whether to emulate mobile device. This includes viewport meta tag, overlay scrollbars, text\nautosizing and more.",
                            "type": "boolean"
                        },
                        {
                            "name": "scale",
                            "description": "Scale to apply to resulting view image.",
                            "experimental": true,
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "screenWidth",
                            "description": "Overriding screen width value in pixels (minimum 0, maximum 10000000).",
                            "experimental": true,
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "screenHeight",
                            "description": "Overriding screen height value in pixels (minimum 0, maximum 10000000).",
                            "experimental": true,
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "positionX",
                            "description": "Overriding view X position on screen in pixels (minimum 0, maximum 10000000).",
                            "experimental": true,
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "positionY",
                            "description": "Overriding view Y position on screen in pixels (minimum 0, maximum 10000000).",
                            "experimental": true,
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "dontSetVisibleSize",
                            "description": "Do not set visible view size, rely upon explicit setVisibleSize call.",
                            "experimental": true,
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "screenOrientation",
                            "description": "Screen orientation override.",
                            "optional": true,
                            "$ref": "ScreenOrientation"
                        },
                        {
                            "name": "viewport",
                            "description": "If set, the visible area of the page will be overridden to this viewport. This viewport\nchange is not observed by the page, e.g. viewport-relative elements do not change positions.",
                            "experimental": true,
                            "optional": true,
                            "$ref": "Page.Viewport"
                        }
                    ]
                },
                {
                    "name": "setScrollbarsHidden",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "hidden",
                            "description": "Whether scrollbars should be always hidden.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setDocumentCookieDisabled",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "disabled",
                            "description": "Whether document.coookie API should be disabled.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setEmitTouchEventsForMouse",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "enabled",
                            "description": "Whether touch emulation based on mouse input should be enabled.",
                            "type": "boolean"
                        },
                        {
                            "name": "configuration",
                            "description": "Touch/gesture events configuration. Default: current platform.",
                            "optional": true,
                            "type": "string",
                            "enum": [
                                "mobile",
                                "desktop"
                            ]
                        }
                    ]
                },
                {
                    "name": "setEmulatedMedia",
                    "description": "Emulates the given media for CSS media queries.",
                    "parameters": [
                        {
                            "name": "media",
                            "description": "Media type to emulate. Empty string disables the override.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "setGeolocationOverride",
                    "description": "Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position\nunavailable.",
                    "parameters": [
                        {
                            "name": "latitude",
                            "description": "Mock latitude",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "longitude",
                            "description": "Mock longitude",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "accuracy",
                            "description": "Mock accuracy",
                            "optional": true,
                            "type": "number"
                        }
                    ]
                },
                {
                    "name": "setNavigatorOverrides",
                    "description": "Overrides value returned by the javascript navigator object.",
                    "experimental": true,
                    "deprecated": true,
                    "parameters": [
                        {
                            "name": "platform",
                            "description": "The platform navigator.platform should return.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "setPageScaleFactor",
                    "description": "Sets a specified page scale factor.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "pageScaleFactor",
                            "description": "Page scale factor.",
                            "type": "number"
                        }
                    ]
                },
                {
                    "name": "setScriptExecutionDisabled",
                    "description": "Switches script execution in the page.",
                    "parameters": [
                        {
                            "name": "value",
                            "description": "Whether script execution should be disabled in the page.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setTouchEmulationEnabled",
                    "description": "Enables touch on platforms which do not support them.",
                    "parameters": [
                        {
                            "name": "enabled",
                            "description": "Whether the touch event emulation should be enabled.",
                            "type": "boolean"
                        },
                        {
                            "name": "maxTouchPoints",
                            "description": "Maximum touch points supported. Defaults to one.",
                            "optional": true,
                            "type": "integer"
                        }
                    ]
                },
                {
                    "name": "setVirtualTimePolicy",
                    "description": "Turns on virtual time for all frames (replacing real-time with a synthetic time source) and sets\nthe current virtual time policy.  Note this supersedes any previous time budget.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "policy",
                            "$ref": "VirtualTimePolicy"
                        },
                        {
                            "name": "budget",
                            "description": "If set, after this many virtual milliseconds have elapsed virtual time will be paused and a\nvirtualTimeBudgetExpired event is sent.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "maxVirtualTimeTaskStarvationCount",
                            "description": "If set this specifies the maximum number of tasks that can be run before virtual is forced\nforwards to prevent deadlock.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "waitForNavigation",
                            "description": "If set the virtual time policy change should be deferred until any frame starts navigating.\nNote any previous deferred policy change is superseded.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "initialVirtualTime",
                            "description": "If set, base::Time::Now will be overriden to initially return this value.",
                            "optional": true,
                            "$ref": "Network.TimeSinceEpoch"
                        }
                    ],
                    "returns": [
                        {
                            "name": "virtualTimeTicksBase",
                            "description": "Absolute timestamp at which virtual time was first enabled (up time in milliseconds).",
                            "type": "number"
                        }
                    ]
                },
                {
                    "name": "setVisibleSize",
                    "description": "Resizes the frame/viewport of the page. Note that this does not affect the frame's container\n(e.g. browser window). Can be used to produce screenshots of the specified size. Not supported\non Android.",
                    "experimental": true,
                    "deprecated": true,
                    "parameters": [
                        {
                            "name": "width",
                            "description": "Frame width (DIP).",
                            "type": "integer"
                        },
                        {
                            "name": "height",
                            "description": "Frame height (DIP).",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "name": "setUserAgentOverride",
                    "description": "Allows overriding user agent with the given string.",
                    "parameters": [
                        {
                            "name": "userAgent",
                            "description": "User agent to use.",
                            "type": "string"
                        },
                        {
                            "name": "acceptLanguage",
                            "description": "Browser langugage to emulate.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "platform",
                            "description": "The platform navigator.platform should return.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "virtualTimeAdvanced",
                    "description": "Notification sent after the virtual time has advanced.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "virtualTimeElapsed",
                            "description": "The amount of virtual time that has elapsed in milliseconds since virtual time was first\nenabled.",
                            "type": "number"
                        }
                    ]
                },
                {
                    "name": "virtualTimeBudgetExpired",
                    "description": "Notification sent after the virtual time budget for the current VirtualTimePolicy has run out.",
                    "experimental": true
                },
                {
                    "name": "virtualTimePaused",
                    "description": "Notification sent after the virtual time has paused.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "virtualTimeElapsed",
                            "description": "The amount of virtual time that has elapsed in milliseconds since virtual time was first\nenabled.",
                            "type": "number"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "HeadlessExperimental",
            "description": "This domain provides experimental commands only supported in headless mode.",
            "experimental": true,
            "dependencies": [
                "Page",
                "Runtime"
            ],
            "types": [
                {
                    "id": "ScreenshotParams",
                    "description": "Encoding options for a screenshot.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "format",
                            "description": "Image compression format (defaults to png).",
                            "optional": true,
                            "type": "string",
                            "enum": [
                                "jpeg",
                                "png"
                            ]
                        },
                        {
                            "name": "quality",
                            "description": "Compression quality from range [0..100] (jpeg only).",
                            "optional": true,
                            "type": "integer"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "beginFrame",
                    "description": "Sends a BeginFrame to the target and returns when the frame was completed. Optionally captures a\nscreenshot from the resulting frame. Requires that the target was created with enabled\nBeginFrameControl. Designed for use with --run-all-compositor-stages-before-draw, see also\nhttps://goo.gl/3zHXhB for more background.",
                    "parameters": [
                        {
                            "name": "frameTimeTicks",
                            "description": "Timestamp of this BeginFrame in Renderer TimeTicks (milliseconds of uptime). If not set,\nthe current time will be used.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "interval",
                            "description": "The interval between BeginFrames that is reported to the compositor, in milliseconds.\nDefaults to a 60 frames/second interval, i.e. about 16.666 milliseconds.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "noDisplayUpdates",
                            "description": "Whether updates should not be committed and drawn onto the display. False by default. If\ntrue, only side effects of the BeginFrame will be run, such as layout and animations, but\nany visual updates may not be visible on the display or in screenshots.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "screenshot",
                            "description": "If set, a screenshot of the frame will be captured and returned in the response. Otherwise,\nno screenshot will be captured. Note that capturing a screenshot can fail, for example,\nduring renderer initialization. In such a case, no screenshot data will be returned.",
                            "optional": true,
                            "$ref": "ScreenshotParams"
                        }
                    ],
                    "returns": [
                        {
                            "name": "hasDamage",
                            "description": "Whether the BeginFrame resulted in damage and, thus, a new frame was committed to the\ndisplay. Reported for diagnostic uses, may be removed in the future.",
                            "type": "boolean"
                        },
                        {
                            "name": "screenshotData",
                            "description": "Base64-encoded image data of the screenshot, if one was requested and successfully taken.",
                            "optional": true,
                            "type": "binary"
                        }
                    ]
                },
                {
                    "name": "disable",
                    "description": "Disables headless events for the target."
                },
                {
                    "name": "enable",
                    "description": "Enables headless events for the target."
                }
            ],
            "events": [
                {
                    "name": "needsBeginFramesChanged",
                    "description": "Issued when the target starts or stops needing BeginFrames.",
                    "parameters": [
                        {
                            "name": "needsBeginFrames",
                            "description": "True if BeginFrames are needed, false otherwise.",
                            "type": "boolean"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "IO",
            "description": "Input/Output operations for streams produced by DevTools.",
            "types": [
                {
                    "id": "StreamHandle",
                    "description": "This is either obtained from another method or specifed as `blob:&lt;uuid&gt;` where\n`&lt;uuid&gt` is an UUID of a Blob.",
                    "type": "string"
                }
            ],
            "commands": [
                {
                    "name": "close",
                    "description": "Close the stream, discard any temporary backing storage.",
                    "parameters": [
                        {
                            "name": "handle",
                            "description": "Handle of the stream to close.",
                            "$ref": "StreamHandle"
                        }
                    ]
                },
                {
                    "name": "read",
                    "description": "Read a chunk of the stream",
                    "parameters": [
                        {
                            "name": "handle",
                            "description": "Handle of the stream to read.",
                            "$ref": "StreamHandle"
                        },
                        {
                            "name": "offset",
                            "description": "Seek to the specified offset before reading (if not specificed, proceed with offset\nfollowing the last read). Some types of streams may only support sequential reads.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "size",
                            "description": "Maximum number of bytes to read (left upon the agent discretion if not specified).",
                            "optional": true,
                            "type": "integer"
                        }
                    ],
                    "returns": [
                        {
                            "name": "base64Encoded",
                            "description": "Set if the data is base64-encoded",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "data",
                            "description": "Data that were read.",
                            "type": "string"
                        },
                        {
                            "name": "eof",
                            "description": "Set if the end-of-file condition occured while reading.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "resolveBlob",
                    "description": "Return UUID of Blob object specified by a remote object id.",
                    "parameters": [
                        {
                            "name": "objectId",
                            "description": "Object id of a Blob object wrapper.",
                            "$ref": "Runtime.RemoteObjectId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "uuid",
                            "description": "UUID of the specified Blob.",
                            "type": "string"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "IndexedDB",
            "experimental": true,
            "dependencies": [
                "Runtime"
            ],
            "types": [
                {
                    "id": "DatabaseWithObjectStores",
                    "description": "Database with an array of object stores.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "name",
                            "description": "Database name.",
                            "type": "string"
                        },
                        {
                            "name": "version",
                            "description": "Database version.",
                            "type": "integer"
                        },
                        {
                            "name": "objectStores",
                            "description": "Object stores in this database.",
                            "type": "array",
                            "items": {
                                "$ref": "ObjectStore"
                            }
                        }
                    ]
                },
                {
                    "id": "ObjectStore",
                    "description": "Object store.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "name",
                            "description": "Object store name.",
                            "type": "string"
                        },
                        {
                            "name": "keyPath",
                            "description": "Object store key path.",
                            "$ref": "KeyPath"
                        },
                        {
                            "name": "autoIncrement",
                            "description": "If true, object store has auto increment flag set.",
                            "type": "boolean"
                        },
                        {
                            "name": "indexes",
                            "description": "Indexes in this object store.",
                            "type": "array",
                            "items": {
                                "$ref": "ObjectStoreIndex"
                            }
                        }
                    ]
                },
                {
                    "id": "ObjectStoreIndex",
                    "description": "Object store index.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "name",
                            "description": "Index name.",
                            "type": "string"
                        },
                        {
                            "name": "keyPath",
                            "description": "Index key path.",
                            "$ref": "KeyPath"
                        },
                        {
                            "name": "unique",
                            "description": "If true, index is unique.",
                            "type": "boolean"
                        },
                        {
                            "name": "multiEntry",
                            "description": "If true, index allows multiple entries for a key.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "id": "Key",
                    "description": "Key.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "type",
                            "description": "Key type.",
                            "type": "string",
                            "enum": [
                                "number",
                                "string",
                                "date",
                                "array"
                            ]
                        },
                        {
                            "name": "number",
                            "description": "Number value.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "string",
                            "description": "String value.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "date",
                            "description": "Date value.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "array",
                            "description": "Array value.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "Key"
                            }
                        }
                    ]
                },
                {
                    "id": "KeyRange",
                    "description": "Key range.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "lower",
                            "description": "Lower bound.",
                            "optional": true,
                            "$ref": "Key"
                        },
                        {
                            "name": "upper",
                            "description": "Upper bound.",
                            "optional": true,
                            "$ref": "Key"
                        },
                        {
                            "name": "lowerOpen",
                            "description": "If true lower bound is open.",
                            "type": "boolean"
                        },
                        {
                            "name": "upperOpen",
                            "description": "If true upper bound is open.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "id": "DataEntry",
                    "description": "Data entry.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "key",
                            "description": "Key object.",
                            "$ref": "Runtime.RemoteObject"
                        },
                        {
                            "name": "primaryKey",
                            "description": "Primary key object.",
                            "$ref": "Runtime.RemoteObject"
                        },
                        {
                            "name": "value",
                            "description": "Value object.",
                            "$ref": "Runtime.RemoteObject"
                        }
                    ]
                },
                {
                    "id": "KeyPath",
                    "description": "Key path.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "type",
                            "description": "Key path type.",
                            "type": "string",
                            "enum": [
                                "null",
                                "string",
                                "array"
                            ]
                        },
                        {
                            "name": "string",
                            "description": "String value.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "array",
                            "description": "Array value.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "clearObjectStore",
                    "description": "Clears all entries from an object store.",
                    "parameters": [
                        {
                            "name": "securityOrigin",
                            "description": "Security origin.",
                            "type": "string"
                        },
                        {
                            "name": "databaseName",
                            "description": "Database name.",
                            "type": "string"
                        },
                        {
                            "name": "objectStoreName",
                            "description": "Object store name.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "deleteDatabase",
                    "description": "Deletes a database.",
                    "parameters": [
                        {
                            "name": "securityOrigin",
                            "description": "Security origin.",
                            "type": "string"
                        },
                        {
                            "name": "databaseName",
                            "description": "Database name.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "deleteObjectStoreEntries",
                    "description": "Delete a range of entries from an object store",
                    "parameters": [
                        {
                            "name": "securityOrigin",
                            "type": "string"
                        },
                        {
                            "name": "databaseName",
                            "type": "string"
                        },
                        {
                            "name": "objectStoreName",
                            "type": "string"
                        },
                        {
                            "name": "keyRange",
                            "description": "Range of entry keys to delete",
                            "$ref": "KeyRange"
                        }
                    ]
                },
                {
                    "name": "disable",
                    "description": "Disables events from backend."
                },
                {
                    "name": "enable",
                    "description": "Enables events from backend."
                },
                {
                    "name": "requestData",
                    "description": "Requests data from object store or index.",
                    "parameters": [
                        {
                            "name": "securityOrigin",
                            "description": "Security origin.",
                            "type": "string"
                        },
                        {
                            "name": "databaseName",
                            "description": "Database name.",
                            "type": "string"
                        },
                        {
                            "name": "objectStoreName",
                            "description": "Object store name.",
                            "type": "string"
                        },
                        {
                            "name": "indexName",
                            "description": "Index name, empty string for object store data requests.",
                            "type": "string"
                        },
                        {
                            "name": "skipCount",
                            "description": "Number of records to skip.",
                            "type": "integer"
                        },
                        {
                            "name": "pageSize",
                            "description": "Number of records to fetch.",
                            "type": "integer"
                        },
                        {
                            "name": "keyRange",
                            "description": "Key range.",
                            "optional": true,
                            "$ref": "KeyRange"
                        }
                    ],
                    "returns": [
                        {
                            "name": "objectStoreDataEntries",
                            "description": "Array of object store data entries.",
                            "type": "array",
                            "items": {
                                "$ref": "DataEntry"
                            }
                        },
                        {
                            "name": "hasMore",
                            "description": "If true, there are more entries to fetch in the given range.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "requestDatabase",
                    "description": "Requests database with given name in given frame.",
                    "parameters": [
                        {
                            "name": "securityOrigin",
                            "description": "Security origin.",
                            "type": "string"
                        },
                        {
                            "name": "databaseName",
                            "description": "Database name.",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "databaseWithObjectStores",
                            "description": "Database with an array of object stores.",
                            "$ref": "DatabaseWithObjectStores"
                        }
                    ]
                },
                {
                    "name": "requestDatabaseNames",
                    "description": "Requests database names for given security origin.",
                    "parameters": [
                        {
                            "name": "securityOrigin",
                            "description": "Security origin.",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "databaseNames",
                            "description": "Database names for origin.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Input",
            "types": [
                {
                    "id": "TouchPoint",
                    "type": "object",
                    "properties": [
                        {
                            "name": "x",
                            "description": "X coordinate of the event relative to the main frame's viewport in CSS pixels.",
                            "type": "number"
                        },
                        {
                            "name": "y",
                            "description": "Y coordinate of the event relative to the main frame's viewport in CSS pixels. 0 refers to\nthe top of the viewport and Y increases as it proceeds towards the bottom of the viewport.",
                            "type": "number"
                        },
                        {
                            "name": "radiusX",
                            "description": "X radius of the touch area (default: 1.0).",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "radiusY",
                            "description": "Y radius of the touch area (default: 1.0).",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "rotationAngle",
                            "description": "Rotation angle (default: 0.0).",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "force",
                            "description": "Force (default: 1.0).",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "id",
                            "description": "Identifier used to track touch sources between events, must be unique within an event.",
                            "optional": true,
                            "type": "number"
                        }
                    ]
                },
                {
                    "id": "GestureSourceType",
                    "experimental": true,
                    "type": "string",
                    "enum": [
                        "default",
                        "touch",
                        "mouse"
                    ]
                },
                {
                    "id": "TimeSinceEpoch",
                    "description": "UTC time in seconds, counted from January 1, 1970.",
                    "type": "number"
                }
            ],
            "commands": [
                {
                    "name": "dispatchKeyEvent",
                    "description": "Dispatches a key event to the page.",
                    "parameters": [
                        {
                            "name": "type",
                            "description": "Type of the key event.",
                            "type": "string",
                            "enum": [
                                "keyDown",
                                "keyUp",
                                "rawKeyDown",
                                "char"
                            ]
                        },
                        {
                            "name": "modifiers",
                            "description": "Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8\n(default: 0).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "timestamp",
                            "description": "Time at which the event occurred.",
                            "optional": true,
                            "$ref": "TimeSinceEpoch"
                        },
                        {
                            "name": "text",
                            "description": "Text as generated by processing a virtual key code with a keyboard layout. Not needed for\nfor `keyUp` and `rawKeyDown` events (default: \"\")",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "unmodifiedText",
                            "description": "Text that would have been generated by the keyboard if no modifiers were pressed (except for\nshift). Useful for shortcut (accelerator) key handling (default: \"\").",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "keyIdentifier",
                            "description": "Unique key identifier (e.g., 'U+0041') (default: \"\").",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "code",
                            "description": "Unique DOM defined string value for each physical key (e.g., 'KeyA') (default: \"\").",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "key",
                            "description": "Unique DOM defined string value describing the meaning of the key in the context of active\nmodifiers, keyboard layout, etc (e.g., 'AltGr') (default: \"\").",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "windowsVirtualKeyCode",
                            "description": "Windows virtual key code (default: 0).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "nativeVirtualKeyCode",
                            "description": "Native virtual key code (default: 0).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "autoRepeat",
                            "description": "Whether the event was generated from auto repeat (default: false).",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "isKeypad",
                            "description": "Whether the event was generated from the keypad (default: false).",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "isSystemKey",
                            "description": "Whether the event was a system key event (default: false).",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "location",
                            "description": "Whether the event was from the left or right side of the keyboard. 1=Left, 2=Right (default:\n0).",
                            "optional": true,
                            "type": "integer"
                        }
                    ]
                },
                {
                    "name": "insertText",
                    "description": "This method emulates inserting text that doesn't come from a key press,\nfor example an emoji keyboard or an IME.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "text",
                            "description": "The text to insert.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "dispatchMouseEvent",
                    "description": "Dispatches a mouse event to the page.",
                    "parameters": [
                        {
                            "name": "type",
                            "description": "Type of the mouse event.",
                            "type": "string",
                            "enum": [
                                "mousePressed",
                                "mouseReleased",
                                "mouseMoved",
                                "mouseWheel"
                            ]
                        },
                        {
                            "name": "x",
                            "description": "X coordinate of the event relative to the main frame's viewport in CSS pixels.",
                            "type": "number"
                        },
                        {
                            "name": "y",
                            "description": "Y coordinate of the event relative to the main frame's viewport in CSS pixels. 0 refers to\nthe top of the viewport and Y increases as it proceeds towards the bottom of the viewport.",
                            "type": "number"
                        },
                        {
                            "name": "modifiers",
                            "description": "Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8\n(default: 0).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "timestamp",
                            "description": "Time at which the event occurred.",
                            "optional": true,
                            "$ref": "TimeSinceEpoch"
                        },
                        {
                            "name": "button",
                            "description": "Mouse button (default: \"none\").",
                            "optional": true,
                            "type": "string",
                            "enum": [
                                "none",
                                "left",
                                "middle",
                                "right"
                            ]
                        },
                        {
                            "name": "clickCount",
                            "description": "Number of times the mouse button was clicked (default: 0).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "deltaX",
                            "description": "X delta in CSS pixels for mouse wheel event (default: 0).",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "deltaY",
                            "description": "Y delta in CSS pixels for mouse wheel event (default: 0).",
                            "optional": true,
                            "type": "number"
                        }
                    ]
                },
                {
                    "name": "dispatchTouchEvent",
                    "description": "Dispatches a touch event to the page.",
                    "parameters": [
                        {
                            "name": "type",
                            "description": "Type of the touch event. TouchEnd and TouchCancel must not contain any touch points, while\nTouchStart and TouchMove must contains at least one.",
                            "type": "string",
                            "enum": [
                                "touchStart",
                                "touchEnd",
                                "touchMove",
                                "touchCancel"
                            ]
                        },
                        {
                            "name": "touchPoints",
                            "description": "Active touch points on the touch device. One event per any changed point (compared to\nprevious touch event in a sequence) is generated, emulating pressing/moving/releasing points\none by one.",
                            "type": "array",
                            "items": {
                                "$ref": "TouchPoint"
                            }
                        },
                        {
                            "name": "modifiers",
                            "description": "Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8\n(default: 0).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "timestamp",
                            "description": "Time at which the event occurred.",
                            "optional": true,
                            "$ref": "TimeSinceEpoch"
                        }
                    ]
                },
                {
                    "name": "emulateTouchFromMouseEvent",
                    "description": "Emulates touch event from the mouse event parameters.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "type",
                            "description": "Type of the mouse event.",
                            "type": "string",
                            "enum": [
                                "mousePressed",
                                "mouseReleased",
                                "mouseMoved",
                                "mouseWheel"
                            ]
                        },
                        {
                            "name": "x",
                            "description": "X coordinate of the mouse pointer in DIP.",
                            "type": "integer"
                        },
                        {
                            "name": "y",
                            "description": "Y coordinate of the mouse pointer in DIP.",
                            "type": "integer"
                        },
                        {
                            "name": "button",
                            "description": "Mouse button.",
                            "type": "string",
                            "enum": [
                                "none",
                                "left",
                                "middle",
                                "right"
                            ]
                        },
                        {
                            "name": "timestamp",
                            "description": "Time at which the event occurred (default: current time).",
                            "optional": true,
                            "$ref": "TimeSinceEpoch"
                        },
                        {
                            "name": "deltaX",
                            "description": "X delta in DIP for mouse wheel event (default: 0).",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "deltaY",
                            "description": "Y delta in DIP for mouse wheel event (default: 0).",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "modifiers",
                            "description": "Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8\n(default: 0).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "clickCount",
                            "description": "Number of times the mouse button was clicked (default: 0).",
                            "optional": true,
                            "type": "integer"
                        }
                    ]
                },
                {
                    "name": "setIgnoreInputEvents",
                    "description": "Ignores input events (useful while auditing page).",
                    "parameters": [
                        {
                            "name": "ignore",
                            "description": "Ignores input events processing when set to true.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "synthesizePinchGesture",
                    "description": "Synthesizes a pinch gesture over a time period by issuing appropriate touch events.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "x",
                            "description": "X coordinate of the start of the gesture in CSS pixels.",
                            "type": "number"
                        },
                        {
                            "name": "y",
                            "description": "Y coordinate of the start of the gesture in CSS pixels.",
                            "type": "number"
                        },
                        {
                            "name": "scaleFactor",
                            "description": "Relative scale factor after zooming (>1.0 zooms in, <1.0 zooms out).",
                            "type": "number"
                        },
                        {
                            "name": "relativeSpeed",
                            "description": "Relative pointer speed in pixels per second (default: 800).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "gestureSourceType",
                            "description": "Which type of input events to be generated (default: 'default', which queries the platform\nfor the preferred input type).",
                            "optional": true,
                            "$ref": "GestureSourceType"
                        }
                    ]
                },
                {
                    "name": "synthesizeScrollGesture",
                    "description": "Synthesizes a scroll gesture over a time period by issuing appropriate touch events.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "x",
                            "description": "X coordinate of the start of the gesture in CSS pixels.",
                            "type": "number"
                        },
                        {
                            "name": "y",
                            "description": "Y coordinate of the start of the gesture in CSS pixels.",
                            "type": "number"
                        },
                        {
                            "name": "xDistance",
                            "description": "The distance to scroll along the X axis (positive to scroll left).",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "yDistance",
                            "description": "The distance to scroll along the Y axis (positive to scroll up).",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "xOverscroll",
                            "description": "The number of additional pixels to scroll back along the X axis, in addition to the given\ndistance.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "yOverscroll",
                            "description": "The number of additional pixels to scroll back along the Y axis, in addition to the given\ndistance.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "preventFling",
                            "description": "Prevent fling (default: true).",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "speed",
                            "description": "Swipe speed in pixels per second (default: 800).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "gestureSourceType",
                            "description": "Which type of input events to be generated (default: 'default', which queries the platform\nfor the preferred input type).",
                            "optional": true,
                            "$ref": "GestureSourceType"
                        },
                        {
                            "name": "repeatCount",
                            "description": "The number of times to repeat the gesture (default: 0).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "repeatDelayMs",
                            "description": "The number of milliseconds delay between each repeat. (default: 250).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "interactionMarkerName",
                            "description": "The name of the interaction markers to generate, if not empty (default: \"\").",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "synthesizeTapGesture",
                    "description": "Synthesizes a tap gesture over a time period by issuing appropriate touch events.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "x",
                            "description": "X coordinate of the start of the gesture in CSS pixels.",
                            "type": "number"
                        },
                        {
                            "name": "y",
                            "description": "Y coordinate of the start of the gesture in CSS pixels.",
                            "type": "number"
                        },
                        {
                            "name": "duration",
                            "description": "Duration between touchdown and touchup events in ms (default: 50).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "tapCount",
                            "description": "Number of times to perform the tap (e.g. 2 for double tap, default: 1).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "gestureSourceType",
                            "description": "Which type of input events to be generated (default: 'default', which queries the platform\nfor the preferred input type).",
                            "optional": true,
                            "$ref": "GestureSourceType"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Inspector",
            "experimental": true,
            "commands": [
                {
                    "name": "disable",
                    "description": "Disables inspector domain notifications."
                },
                {
                    "name": "enable",
                    "description": "Enables inspector domain notifications."
                }
            ],
            "events": [
                {
                    "name": "detached",
                    "description": "Fired when remote debugging connection is about to be terminated. Contains detach reason.",
                    "parameters": [
                        {
                            "name": "reason",
                            "description": "The reason why connection has been terminated.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "targetCrashed",
                    "description": "Fired when debugging target has crashed"
                },
                {
                    "name": "targetReloadedAfterCrash",
                    "description": "Fired when debugging target has reloaded after crash"
                }
            ]
        },
        {
            "domain": "LayerTree",
            "experimental": true,
            "dependencies": [
                "DOM"
            ],
            "types": [
                {
                    "id": "LayerId",
                    "description": "Unique Layer identifier.",
                    "type": "string"
                },
                {
                    "id": "SnapshotId",
                    "description": "Unique snapshot identifier.",
                    "type": "string"
                },
                {
                    "id": "ScrollRect",
                    "description": "Rectangle where scrolling happens on the main thread.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "rect",
                            "description": "Rectangle itself.",
                            "$ref": "DOM.Rect"
                        },
                        {
                            "name": "type",
                            "description": "Reason for rectangle to force scrolling on the main thread",
                            "type": "string",
                            "enum": [
                                "RepaintsOnScroll",
                                "TouchEventHandler",
                                "WheelEventHandler"
                            ]
                        }
                    ]
                },
                {
                    "id": "StickyPositionConstraint",
                    "description": "Sticky position constraints.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "stickyBoxRect",
                            "description": "Layout rectangle of the sticky element before being shifted",
                            "$ref": "DOM.Rect"
                        },
                        {
                            "name": "containingBlockRect",
                            "description": "Layout rectangle of the containing block of the sticky element",
                            "$ref": "DOM.Rect"
                        },
                        {
                            "name": "nearestLayerShiftingStickyBox",
                            "description": "The nearest sticky layer that shifts the sticky box",
                            "optional": true,
                            "$ref": "LayerId"
                        },
                        {
                            "name": "nearestLayerShiftingContainingBlock",
                            "description": "The nearest sticky layer that shifts the containing block",
                            "optional": true,
                            "$ref": "LayerId"
                        }
                    ]
                },
                {
                    "id": "PictureTile",
                    "description": "Serialized fragment of layer picture along with its offset within the layer.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "x",
                            "description": "Offset from owning layer left boundary",
                            "type": "number"
                        },
                        {
                            "name": "y",
                            "description": "Offset from owning layer top boundary",
                            "type": "number"
                        },
                        {
                            "name": "picture",
                            "description": "Base64-encoded snapshot data.",
                            "type": "binary"
                        }
                    ]
                },
                {
                    "id": "Layer",
                    "description": "Information about a compositing layer.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "layerId",
                            "description": "The unique id for this layer.",
                            "$ref": "LayerId"
                        },
                        {
                            "name": "parentLayerId",
                            "description": "The id of parent (not present for root).",
                            "optional": true,
                            "$ref": "LayerId"
                        },
                        {
                            "name": "backendNodeId",
                            "description": "The backend id for the node associated with this layer.",
                            "optional": true,
                            "$ref": "DOM.BackendNodeId"
                        },
                        {
                            "name": "offsetX",
                            "description": "Offset from parent layer, X coordinate.",
                            "type": "number"
                        },
                        {
                            "name": "offsetY",
                            "description": "Offset from parent layer, Y coordinate.",
                            "type": "number"
                        },
                        {
                            "name": "width",
                            "description": "Layer width.",
                            "type": "number"
                        },
                        {
                            "name": "height",
                            "description": "Layer height.",
                            "type": "number"
                        },
                        {
                            "name": "transform",
                            "description": "Transformation matrix for layer, default is identity matrix",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "type": "number"
                            }
                        },
                        {
                            "name": "anchorX",
                            "description": "Transform anchor point X, absent if no transform specified",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "anchorY",
                            "description": "Transform anchor point Y, absent if no transform specified",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "anchorZ",
                            "description": "Transform anchor point Z, absent if no transform specified",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "paintCount",
                            "description": "Indicates how many time this layer has painted.",
                            "type": "integer"
                        },
                        {
                            "name": "drawsContent",
                            "description": "Indicates whether this layer hosts any content, rather than being used for\ntransform/scrolling purposes only.",
                            "type": "boolean"
                        },
                        {
                            "name": "invisible",
                            "description": "Set if layer is not visible.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "scrollRects",
                            "description": "Rectangles scrolling on main thread only.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "ScrollRect"
                            }
                        },
                        {
                            "name": "stickyPositionConstraint",
                            "description": "Sticky position constraint information",
                            "optional": true,
                            "$ref": "StickyPositionConstraint"
                        }
                    ]
                },
                {
                    "id": "PaintProfile",
                    "description": "Array of timings, one per paint step.",
                    "type": "array",
                    "items": {
                        "type": "number"
                    }
                }
            ],
            "commands": [
                {
                    "name": "compositingReasons",
                    "description": "Provides the reasons why the given layer was composited.",
                    "parameters": [
                        {
                            "name": "layerId",
                            "description": "The id of the layer for which we want to get the reasons it was composited.",
                            "$ref": "LayerId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "compositingReasons",
                            "description": "A list of strings specifying reasons for the given layer to become composited.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                },
                {
                    "name": "disable",
                    "description": "Disables compositing tree inspection."
                },
                {
                    "name": "enable",
                    "description": "Enables compositing tree inspection."
                },
                {
                    "name": "loadSnapshot",
                    "description": "Returns the snapshot identifier.",
                    "parameters": [
                        {
                            "name": "tiles",
                            "description": "An array of tiles composing the snapshot.",
                            "type": "array",
                            "items": {
                                "$ref": "PictureTile"
                            }
                        }
                    ],
                    "returns": [
                        {
                            "name": "snapshotId",
                            "description": "The id of the snapshot.",
                            "$ref": "SnapshotId"
                        }
                    ]
                },
                {
                    "name": "makeSnapshot",
                    "description": "Returns the layer snapshot identifier.",
                    "parameters": [
                        {
                            "name": "layerId",
                            "description": "The id of the layer.",
                            "$ref": "LayerId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "snapshotId",
                            "description": "The id of the layer snapshot.",
                            "$ref": "SnapshotId"
                        }
                    ]
                },
                {
                    "name": "profileSnapshot",
                    "parameters": [
                        {
                            "name": "snapshotId",
                            "description": "The id of the layer snapshot.",
                            "$ref": "SnapshotId"
                        },
                        {
                            "name": "minRepeatCount",
                            "description": "The maximum number of times to replay the snapshot (1, if not specified).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "minDuration",
                            "description": "The minimum duration (in seconds) to replay the snapshot.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "clipRect",
                            "description": "The clip rectangle to apply when replaying the snapshot.",
                            "optional": true,
                            "$ref": "DOM.Rect"
                        }
                    ],
                    "returns": [
                        {
                            "name": "timings",
                            "description": "The array of paint profiles, one per run.",
                            "type": "array",
                            "items": {
                                "$ref": "PaintProfile"
                            }
                        }
                    ]
                },
                {
                    "name": "releaseSnapshot",
                    "description": "Releases layer snapshot captured by the back-end.",
                    "parameters": [
                        {
                            "name": "snapshotId",
                            "description": "The id of the layer snapshot.",
                            "$ref": "SnapshotId"
                        }
                    ]
                },
                {
                    "name": "replaySnapshot",
                    "description": "Replays the layer snapshot and returns the resulting bitmap.",
                    "parameters": [
                        {
                            "name": "snapshotId",
                            "description": "The id of the layer snapshot.",
                            "$ref": "SnapshotId"
                        },
                        {
                            "name": "fromStep",
                            "description": "The first step to replay from (replay from the very start if not specified).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "toStep",
                            "description": "The last step to replay to (replay till the end if not specified).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "scale",
                            "description": "The scale to apply while replaying (defaults to 1).",
                            "optional": true,
                            "type": "number"
                        }
                    ],
                    "returns": [
                        {
                            "name": "dataURL",
                            "description": "A data: URL for resulting image.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "snapshotCommandLog",
                    "description": "Replays the layer snapshot and returns canvas log.",
                    "parameters": [
                        {
                            "name": "snapshotId",
                            "description": "The id of the layer snapshot.",
                            "$ref": "SnapshotId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "commandLog",
                            "description": "The array of canvas function calls.",
                            "type": "array",
                            "items": {
                                "type": "object"
                            }
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "layerPainted",
                    "parameters": [
                        {
                            "name": "layerId",
                            "description": "The id of the painted layer.",
                            "$ref": "LayerId"
                        },
                        {
                            "name": "clip",
                            "description": "Clip rectangle.",
                            "$ref": "DOM.Rect"
                        }
                    ]
                },
                {
                    "name": "layerTreeDidChange",
                    "parameters": [
                        {
                            "name": "layers",
                            "description": "Layer tree, absent if not in the comspositing mode.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "Layer"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Log",
            "description": "Provides access to log entries.",
            "dependencies": [
                "Runtime",
                "Network"
            ],
            "types": [
                {
                    "id": "LogEntry",
                    "description": "Log entry.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "source",
                            "description": "Log entry source.",
                            "type": "string",
                            "enum": [
                                "xml",
                                "javascript",
                                "network",
                                "storage",
                                "appcache",
                                "rendering",
                                "security",
                                "deprecation",
                                "worker",
                                "violation",
                                "intervention",
                                "recommendation",
                                "other"
                            ]
                        },
                        {
                            "name": "level",
                            "description": "Log entry severity.",
                            "type": "string",
                            "enum": [
                                "verbose",
                                "info",
                                "warning",
                                "error"
                            ]
                        },
                        {
                            "name": "text",
                            "description": "Logged text.",
                            "type": "string"
                        },
                        {
                            "name": "timestamp",
                            "description": "Timestamp when this entry was added.",
                            "$ref": "Runtime.Timestamp"
                        },
                        {
                            "name": "url",
                            "description": "URL of the resource if known.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "lineNumber",
                            "description": "Line number in the resource.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "stackTrace",
                            "description": "JavaScript stack trace.",
                            "optional": true,
                            "$ref": "Runtime.StackTrace"
                        },
                        {
                            "name": "networkRequestId",
                            "description": "Identifier of the network request associated with this entry.",
                            "optional": true,
                            "$ref": "Network.RequestId"
                        },
                        {
                            "name": "workerId",
                            "description": "Identifier of the worker associated with this entry.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "args",
                            "description": "Call arguments.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "Runtime.RemoteObject"
                            }
                        }
                    ]
                },
                {
                    "id": "ViolationSetting",
                    "description": "Violation configuration setting.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "name",
                            "description": "Violation type.",
                            "type": "string",
                            "enum": [
                                "longTask",
                                "longLayout",
                                "blockedEvent",
                                "blockedParser",
                                "discouragedAPIUse",
                                "handler",
                                "recurringHandler"
                            ]
                        },
                        {
                            "name": "threshold",
                            "description": "Time threshold to trigger upon.",
                            "type": "number"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "clear",
                    "description": "Clears the log."
                },
                {
                    "name": "disable",
                    "description": "Disables log domain, prevents further log entries from being reported to the client."
                },
                {
                    "name": "enable",
                    "description": "Enables log domain, sends the entries collected so far to the client by means of the\n`entryAdded` notification."
                },
                {
                    "name": "startViolationsReport",
                    "description": "start violation reporting.",
                    "parameters": [
                        {
                            "name": "config",
                            "description": "Configuration for violations.",
                            "type": "array",
                            "items": {
                                "$ref": "ViolationSetting"
                            }
                        }
                    ]
                },
                {
                    "name": "stopViolationsReport",
                    "description": "Stop violation reporting."
                }
            ],
            "events": [
                {
                    "name": "entryAdded",
                    "description": "Issued when new message was logged.",
                    "parameters": [
                        {
                            "name": "entry",
                            "description": "The entry.",
                            "$ref": "LogEntry"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Memory",
            "experimental": true,
            "types": [
                {
                    "id": "PressureLevel",
                    "description": "Memory pressure level.",
                    "type": "string",
                    "enum": [
                        "moderate",
                        "critical"
                    ]
                },
                {
                    "id": "SamplingProfileNode",
                    "description": "Heap profile sample.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "size",
                            "description": "Size of the sampled allocation.",
                            "type": "number"
                        },
                        {
                            "name": "total",
                            "description": "Total bytes attributed to this sample.",
                            "type": "number"
                        },
                        {
                            "name": "stack",
                            "description": "Execution stack at the point of allocation.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                },
                {
                    "id": "SamplingProfile",
                    "description": "Array of heap profile samples.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "samples",
                            "type": "array",
                            "items": {
                                "$ref": "SamplingProfileNode"
                            }
                        },
                        {
                            "name": "modules",
                            "type": "array",
                            "items": {
                                "$ref": "Module"
                            }
                        }
                    ]
                },
                {
                    "id": "Module",
                    "description": "Executable module information",
                    "type": "object",
                    "properties": [
                        {
                            "name": "name",
                            "description": "Name of the module.",
                            "type": "string"
                        },
                        {
                            "name": "uuid",
                            "description": "UUID of the module.",
                            "type": "string"
                        },
                        {
                            "name": "baseAddress",
                            "description": "Base address where the module is loaded into memory. Encoded as a decimal\nor hexadecimal (0x prefixed) string.",
                            "type": "string"
                        },
                        {
                            "name": "size",
                            "description": "Size of the module in bytes.",
                            "type": "number"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "getDOMCounters",
                    "returns": [
                        {
                            "name": "documents",
                            "type": "integer"
                        },
                        {
                            "name": "nodes",
                            "type": "integer"
                        },
                        {
                            "name": "jsEventListeners",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "name": "prepareForLeakDetection"
                },
                {
                    "name": "setPressureNotificationsSuppressed",
                    "description": "Enable/disable suppressing memory pressure notifications in all processes.",
                    "parameters": [
                        {
                            "name": "suppressed",
                            "description": "If true, memory pressure notifications will be suppressed.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "simulatePressureNotification",
                    "description": "Simulate a memory pressure notification in all processes.",
                    "parameters": [
                        {
                            "name": "level",
                            "description": "Memory pressure level of the notification.",
                            "$ref": "PressureLevel"
                        }
                    ]
                },
                {
                    "name": "startSampling",
                    "description": "Start collecting native memory profile.",
                    "parameters": [
                        {
                            "name": "samplingInterval",
                            "description": "Average number of bytes between samples.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "suppressRandomness",
                            "description": "Do not randomize intervals between samples.",
                            "optional": true,
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "stopSampling",
                    "description": "Stop collecting native memory profile."
                },
                {
                    "name": "getAllTimeSamplingProfile",
                    "description": "Retrieve native memory allocations profile\ncollected since renderer process startup.",
                    "returns": [
                        {
                            "name": "profile",
                            "$ref": "SamplingProfile"
                        }
                    ]
                },
                {
                    "name": "getBrowserSamplingProfile",
                    "description": "Retrieve native memory allocations profile\ncollected since browser process startup.",
                    "returns": [
                        {
                            "name": "profile",
                            "$ref": "SamplingProfile"
                        }
                    ]
                },
                {
                    "name": "getSamplingProfile",
                    "description": "Retrieve native memory allocations profile collected since last\n`startSampling` call.",
                    "returns": [
                        {
                            "name": "profile",
                            "$ref": "SamplingProfile"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Network",
            "description": "Network domain allows tracking network activities of the page. It exposes information about http,\nfile, data and other requests and responses, their headers, bodies, timing, etc.",
            "dependencies": [
                "Debugger",
                "Runtime",
                "Security"
            ],
            "types": [
                {
                    "id": "ResourceType",
                    "description": "Resource type as it was perceived by the rendering engine.",
                    "type": "string",
                    "enum": [
                        "Document",
                        "Stylesheet",
                        "Image",
                        "Media",
                        "Font",
                        "Script",
                        "TextTrack",
                        "XHR",
                        "Fetch",
                        "EventSource",
                        "WebSocket",
                        "Manifest",
                        "SignedExchange",
                        "Ping",
                        "CSPViolationReport",
                        "Other"
                    ]
                },
                {
                    "id": "LoaderId",
                    "description": "Unique loader identifier.",
                    "type": "string"
                },
                {
                    "id": "RequestId",
                    "description": "Unique request identifier.",
                    "type": "string"
                },
                {
                    "id": "InterceptionId",
                    "description": "Unique intercepted request identifier.",
                    "type": "string"
                },
                {
                    "id": "ErrorReason",
                    "description": "Network level fetch failure reason.",
                    "type": "string",
                    "enum": [
                        "Failed",
                        "Aborted",
                        "TimedOut",
                        "AccessDenied",
                        "ConnectionClosed",
                        "ConnectionReset",
                        "ConnectionRefused",
                        "ConnectionAborted",
                        "ConnectionFailed",
                        "NameNotResolved",
                        "InternetDisconnected",
                        "AddressUnreachable",
                        "BlockedByClient",
                        "BlockedByResponse"
                    ]
                },
                {
                    "id": "TimeSinceEpoch",
                    "description": "UTC time in seconds, counted from January 1, 1970.",
                    "type": "number"
                },
                {
                    "id": "MonotonicTime",
                    "description": "Monotonically increasing time in seconds since an arbitrary point in the past.",
                    "type": "number"
                },
                {
                    "id": "Headers",
                    "description": "Request / response headers as keys / values of JSON object.",
                    "type": "object"
                },
                {
                    "id": "ConnectionType",
                    "description": "The underlying connection technology that the browser is supposedly using.",
                    "type": "string",
                    "enum": [
                        "none",
                        "cellular2g",
                        "cellular3g",
                        "cellular4g",
                        "bluetooth",
                        "ethernet",
                        "wifi",
                        "wimax",
                        "other"
                    ]
                },
                {
                    "id": "CookieSameSite",
                    "description": "Represents the cookie's 'SameSite' status:\nhttps://tools.ietf.org/html/draft-west-first-party-cookies",
                    "type": "string",
                    "enum": [
                        "Strict",
                        "Lax"
                    ]
                },
                {
                    "id": "ResourceTiming",
                    "description": "Timing information for the request.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "requestTime",
                            "description": "Timing's requestTime is a baseline in seconds, while the other numbers are ticks in\nmilliseconds relatively to this requestTime.",
                            "type": "number"
                        },
                        {
                            "name": "proxyStart",
                            "description": "Started resolving proxy.",
                            "type": "number"
                        },
                        {
                            "name": "proxyEnd",
                            "description": "Finished resolving proxy.",
                            "type": "number"
                        },
                        {
                            "name": "dnsStart",
                            "description": "Started DNS address resolve.",
                            "type": "number"
                        },
                        {
                            "name": "dnsEnd",
                            "description": "Finished DNS address resolve.",
                            "type": "number"
                        },
                        {
                            "name": "connectStart",
                            "description": "Started connecting to the remote host.",
                            "type": "number"
                        },
                        {
                            "name": "connectEnd",
                            "description": "Connected to the remote host.",
                            "type": "number"
                        },
                        {
                            "name": "sslStart",
                            "description": "Started SSL handshake.",
                            "type": "number"
                        },
                        {
                            "name": "sslEnd",
                            "description": "Finished SSL handshake.",
                            "type": "number"
                        },
                        {
                            "name": "workerStart",
                            "description": "Started running ServiceWorker.",
                            "experimental": true,
                            "type": "number"
                        },
                        {
                            "name": "workerReady",
                            "description": "Finished Starting ServiceWorker.",
                            "experimental": true,
                            "type": "number"
                        },
                        {
                            "name": "sendStart",
                            "description": "Started sending request.",
                            "type": "number"
                        },
                        {
                            "name": "sendEnd",
                            "description": "Finished sending request.",
                            "type": "number"
                        },
                        {
                            "name": "pushStart",
                            "description": "Time the server started pushing request.",
                            "experimental": true,
                            "type": "number"
                        },
                        {
                            "name": "pushEnd",
                            "description": "Time the server finished pushing request.",
                            "experimental": true,
                            "type": "number"
                        },
                        {
                            "name": "receiveHeadersEnd",
                            "description": "Finished receiving response headers.",
                            "type": "number"
                        }
                    ]
                },
                {
                    "id": "ResourcePriority",
                    "description": "Loading priority of a resource request.",
                    "type": "string",
                    "enum": [
                        "VeryLow",
                        "Low",
                        "Medium",
                        "High",
                        "VeryHigh"
                    ]
                },
                {
                    "id": "Request",
                    "description": "HTTP request data.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "url",
                            "description": "Request URL (without fragment).",
                            "type": "string"
                        },
                        {
                            "name": "urlFragment",
                            "description": "Fragment of the requested URL starting with hash, if present.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "method",
                            "description": "HTTP request method.",
                            "type": "string"
                        },
                        {
                            "name": "headers",
                            "description": "HTTP request headers.",
                            "$ref": "Headers"
                        },
                        {
                            "name": "postData",
                            "description": "HTTP POST request data.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "hasPostData",
                            "description": "True when the request has POST data. Note that postData might still be omitted when this flag is true when the data is too long.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "mixedContentType",
                            "description": "The mixed content type of the request.",
                            "optional": true,
                            "$ref": "Security.MixedContentType"
                        },
                        {
                            "name": "initialPriority",
                            "description": "Priority of the resource request at the time request is sent.",
                            "$ref": "ResourcePriority"
                        },
                        {
                            "name": "referrerPolicy",
                            "description": "The referrer policy of the request, as defined in https://www.w3.org/TR/referrer-policy/",
                            "type": "string",
                            "enum": [
                                "unsafe-url",
                                "no-referrer-when-downgrade",
                                "no-referrer",
                                "origin",
                                "origin-when-cross-origin",
                                "same-origin",
                                "strict-origin",
                                "strict-origin-when-cross-origin"
                            ]
                        },
                        {
                            "name": "isLinkPreload",
                            "description": "Whether is loaded via link preload.",
                            "optional": true,
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "id": "SignedCertificateTimestamp",
                    "description": "Details of a signed certificate timestamp (SCT).",
                    "type": "object",
                    "properties": [
                        {
                            "name": "status",
                            "description": "Validation status.",
                            "type": "string"
                        },
                        {
                            "name": "origin",
                            "description": "Origin.",
                            "type": "string"
                        },
                        {
                            "name": "logDescription",
                            "description": "Log name / description.",
                            "type": "string"
                        },
                        {
                            "name": "logId",
                            "description": "Log ID.",
                            "type": "string"
                        },
                        {
                            "name": "timestamp",
                            "description": "Issuance date.",
                            "$ref": "TimeSinceEpoch"
                        },
                        {
                            "name": "hashAlgorithm",
                            "description": "Hash algorithm.",
                            "type": "string"
                        },
                        {
                            "name": "signatureAlgorithm",
                            "description": "Signature algorithm.",
                            "type": "string"
                        },
                        {
                            "name": "signatureData",
                            "description": "Signature data.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "SecurityDetails",
                    "description": "Security details about a request.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "protocol",
                            "description": "Protocol name (e.g. \"TLS 1.2\" or \"QUIC\").",
                            "type": "string"
                        },
                        {
                            "name": "keyExchange",
                            "description": "Key Exchange used by the connection, or the empty string if not applicable.",
                            "type": "string"
                        },
                        {
                            "name": "keyExchangeGroup",
                            "description": "(EC)DH group used by the connection, if applicable.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "cipher",
                            "description": "Cipher name.",
                            "type": "string"
                        },
                        {
                            "name": "mac",
                            "description": "TLS MAC. Note that AEAD ciphers do not have separate MACs.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "certificateId",
                            "description": "Certificate ID value.",
                            "$ref": "Security.CertificateId"
                        },
                        {
                            "name": "subjectName",
                            "description": "Certificate subject name.",
                            "type": "string"
                        },
                        {
                            "name": "sanList",
                            "description": "Subject Alternative Name (SAN) DNS names and IP addresses.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "issuer",
                            "description": "Name of the issuing CA.",
                            "type": "string"
                        },
                        {
                            "name": "validFrom",
                            "description": "Certificate valid from date.",
                            "$ref": "TimeSinceEpoch"
                        },
                        {
                            "name": "validTo",
                            "description": "Certificate valid to (expiration) date",
                            "$ref": "TimeSinceEpoch"
                        },
                        {
                            "name": "signedCertificateTimestampList",
                            "description": "List of signed certificate timestamps (SCTs).",
                            "type": "array",
                            "items": {
                                "$ref": "SignedCertificateTimestamp"
                            }
                        },
                        {
                            "name": "certificateTransparencyCompliance",
                            "description": "Whether the request complied with Certificate Transparency policy",
                            "$ref": "CertificateTransparencyCompliance"
                        }
                    ]
                },
                {
                    "id": "CertificateTransparencyCompliance",
                    "description": "Whether the request complied with Certificate Transparency policy.",
                    "type": "string",
                    "enum": [
                        "unknown",
                        "not-compliant",
                        "compliant"
                    ]
                },
                {
                    "id": "BlockedReason",
                    "description": "The reason why request was blocked.",
                    "type": "string",
                    "enum": [
                        "other",
                        "csp",
                        "mixed-content",
                        "origin",
                        "inspector",
                        "subresource-filter",
                        "content-type",
                        "collapsed-by-client"
                    ]
                },
                {
                    "id": "Response",
                    "description": "HTTP response data.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "url",
                            "description": "Response URL. This URL can be different from CachedResource.url in case of redirect.",
                            "type": "string"
                        },
                        {
                            "name": "status",
                            "description": "HTTP response status code.",
                            "type": "integer"
                        },
                        {
                            "name": "statusText",
                            "description": "HTTP response status text.",
                            "type": "string"
                        },
                        {
                            "name": "headers",
                            "description": "HTTP response headers.",
                            "$ref": "Headers"
                        },
                        {
                            "name": "headersText",
                            "description": "HTTP response headers text.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "mimeType",
                            "description": "Resource mimeType as determined by the browser.",
                            "type": "string"
                        },
                        {
                            "name": "requestHeaders",
                            "description": "Refined HTTP request headers that were actually transmitted over the network.",
                            "optional": true,
                            "$ref": "Headers"
                        },
                        {
                            "name": "requestHeadersText",
                            "description": "HTTP request headers text.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "connectionReused",
                            "description": "Specifies whether physical connection was actually reused for this request.",
                            "type": "boolean"
                        },
                        {
                            "name": "connectionId",
                            "description": "Physical connection id that was actually used for this request.",
                            "type": "number"
                        },
                        {
                            "name": "remoteIPAddress",
                            "description": "Remote IP address.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "remotePort",
                            "description": "Remote port.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "fromDiskCache",
                            "description": "Specifies that the request was served from the disk cache.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "fromServiceWorker",
                            "description": "Specifies that the request was served from the ServiceWorker.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "encodedDataLength",
                            "description": "Total number of bytes received for this request so far.",
                            "type": "number"
                        },
                        {
                            "name": "timing",
                            "description": "Timing information for the given request.",
                            "optional": true,
                            "$ref": "ResourceTiming"
                        },
                        {
                            "name": "protocol",
                            "description": "Protocol used to fetch this request.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "securityState",
                            "description": "Security state of the request resource.",
                            "$ref": "Security.SecurityState"
                        },
                        {
                            "name": "securityDetails",
                            "description": "Security details for the request.",
                            "optional": true,
                            "$ref": "SecurityDetails"
                        }
                    ]
                },
                {
                    "id": "WebSocketRequest",
                    "description": "WebSocket request data.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "headers",
                            "description": "HTTP request headers.",
                            "$ref": "Headers"
                        }
                    ]
                },
                {
                    "id": "WebSocketResponse",
                    "description": "WebSocket response data.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "status",
                            "description": "HTTP response status code.",
                            "type": "integer"
                        },
                        {
                            "name": "statusText",
                            "description": "HTTP response status text.",
                            "type": "string"
                        },
                        {
                            "name": "headers",
                            "description": "HTTP response headers.",
                            "$ref": "Headers"
                        },
                        {
                            "name": "headersText",
                            "description": "HTTP response headers text.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "requestHeaders",
                            "description": "HTTP request headers.",
                            "optional": true,
                            "$ref": "Headers"
                        },
                        {
                            "name": "requestHeadersText",
                            "description": "HTTP request headers text.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "WebSocketFrame",
                    "description": "WebSocket frame data.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "opcode",
                            "description": "WebSocket frame opcode.",
                            "type": "number"
                        },
                        {
                            "name": "mask",
                            "description": "WebSocke frame mask.",
                            "type": "boolean"
                        },
                        {
                            "name": "payloadData",
                            "description": "WebSocke frame payload data.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "CachedResource",
                    "description": "Information about the cached resource.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "url",
                            "description": "Resource URL. This is the url of the original network request.",
                            "type": "string"
                        },
                        {
                            "name": "type",
                            "description": "Type of this resource.",
                            "$ref": "ResourceType"
                        },
                        {
                            "name": "response",
                            "description": "Cached response data.",
                            "optional": true,
                            "$ref": "Response"
                        },
                        {
                            "name": "bodySize",
                            "description": "Cached response body size.",
                            "type": "number"
                        }
                    ]
                },
                {
                    "id": "Initiator",
                    "description": "Information about the request initiator.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "type",
                            "description": "Type of this initiator.",
                            "type": "string",
                            "enum": [
                                "parser",
                                "script",
                                "preload",
                                "SignedExchange",
                                "other"
                            ]
                        },
                        {
                            "name": "stack",
                            "description": "Initiator JavaScript stack trace, set for Script only.",
                            "optional": true,
                            "$ref": "Runtime.StackTrace"
                        },
                        {
                            "name": "url",
                            "description": "Initiator URL, set for Parser type or for Script type (when script is importing module) or for SignedExchange type.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "lineNumber",
                            "description": "Initiator line number, set for Parser type or for Script type (when script is importing\nmodule) (0-based).",
                            "optional": true,
                            "type": "number"
                        }
                    ]
                },
                {
                    "id": "Cookie",
                    "description": "Cookie object",
                    "type": "object",
                    "properties": [
                        {
                            "name": "name",
                            "description": "Cookie name.",
                            "type": "string"
                        },
                        {
                            "name": "value",
                            "description": "Cookie value.",
                            "type": "string"
                        },
                        {
                            "name": "domain",
                            "description": "Cookie domain.",
                            "type": "string"
                        },
                        {
                            "name": "path",
                            "description": "Cookie path.",
                            "type": "string"
                        },
                        {
                            "name": "expires",
                            "description": "Cookie expiration date as the number of seconds since the UNIX epoch.",
                            "type": "number"
                        },
                        {
                            "name": "size",
                            "description": "Cookie size.",
                            "type": "integer"
                        },
                        {
                            "name": "httpOnly",
                            "description": "True if cookie is http-only.",
                            "type": "boolean"
                        },
                        {
                            "name": "secure",
                            "description": "True if cookie is secure.",
                            "type": "boolean"
                        },
                        {
                            "name": "session",
                            "description": "True in case of session cookie.",
                            "type": "boolean"
                        },
                        {
                            "name": "sameSite",
                            "description": "Cookie SameSite type.",
                            "optional": true,
                            "$ref": "CookieSameSite"
                        }
                    ]
                },
                {
                    "id": "CookieParam",
                    "description": "Cookie parameter object",
                    "type": "object",
                    "properties": [
                        {
                            "name": "name",
                            "description": "Cookie name.",
                            "type": "string"
                        },
                        {
                            "name": "value",
                            "description": "Cookie value.",
                            "type": "string"
                        },
                        {
                            "name": "url",
                            "description": "The request-URI to associate with the setting of the cookie. This value can affect the\ndefault domain and path values of the created cookie.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "domain",
                            "description": "Cookie domain.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "path",
                            "description": "Cookie path.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "secure",
                            "description": "True if cookie is secure.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "httpOnly",
                            "description": "True if cookie is http-only.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "sameSite",
                            "description": "Cookie SameSite type.",
                            "optional": true,
                            "$ref": "CookieSameSite"
                        },
                        {
                            "name": "expires",
                            "description": "Cookie expiration date, session cookie if not set",
                            "optional": true,
                            "$ref": "TimeSinceEpoch"
                        }
                    ]
                },
                {
                    "id": "AuthChallenge",
                    "description": "Authorization challenge for HTTP status code 401 or 407.",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "source",
                            "description": "Source of the authentication challenge.",
                            "optional": true,
                            "type": "string",
                            "enum": [
                                "Server",
                                "Proxy"
                            ]
                        },
                        {
                            "name": "origin",
                            "description": "Origin of the challenger.",
                            "type": "string"
                        },
                        {
                            "name": "scheme",
                            "description": "The authentication scheme used, such as basic or digest",
                            "type": "string"
                        },
                        {
                            "name": "realm",
                            "description": "The realm of the challenge. May be empty.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "AuthChallengeResponse",
                    "description": "Response to an AuthChallenge.",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "response",
                            "description": "The decision on what to do in response to the authorization challenge.  Default means\ndeferring to the default behavior of the net stack, which will likely either the Cancel\nauthentication or display a popup dialog box.",
                            "type": "string",
                            "enum": [
                                "Default",
                                "CancelAuth",
                                "ProvideCredentials"
                            ]
                        },
                        {
                            "name": "username",
                            "description": "The username to provide, possibly empty. Should only be set if response is\nProvideCredentials.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "password",
                            "description": "The password to provide, possibly empty. Should only be set if response is\nProvideCredentials.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "InterceptionStage",
                    "description": "Stages of the interception to begin intercepting. Request will intercept before the request is\nsent. Response will intercept after the response is received.",
                    "experimental": true,
                    "type": "string",
                    "enum": [
                        "Request",
                        "HeadersReceived"
                    ]
                },
                {
                    "id": "RequestPattern",
                    "description": "Request pattern for interception.",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "urlPattern",
                            "description": "Wildcards ('*' -> zero or more, '?' -> exactly one) are allowed. Escape character is\nbackslash. Omitting is equivalent to \"*\".",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "resourceType",
                            "description": "If set, only requests for matching resource types will be intercepted.",
                            "optional": true,
                            "$ref": "ResourceType"
                        },
                        {
                            "name": "interceptionStage",
                            "description": "Stage at wich to begin intercepting requests. Default is Request.",
                            "optional": true,
                            "$ref": "InterceptionStage"
                        }
                    ]
                },
                {
                    "id": "SignedExchangeSignature",
                    "description": "Information about a signed exchange signature.\nhttps://wicg.github.io/webpackage/draft-yasskin-httpbis-origin-signed-exchanges-impl.html#rfc.section.3.1",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "label",
                            "description": "Signed exchange signature label.",
                            "type": "string"
                        },
                        {
                            "name": "signature",
                            "description": "The hex string of signed exchange signature.",
                            "type": "string"
                        },
                        {
                            "name": "integrity",
                            "description": "Signed exchange signature integrity.",
                            "type": "string"
                        },
                        {
                            "name": "certUrl",
                            "description": "Signed exchange signature cert Url.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "certSha256",
                            "description": "The hex string of signed exchange signature cert sha256.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "validityUrl",
                            "description": "Signed exchange signature validity Url.",
                            "type": "string"
                        },
                        {
                            "name": "date",
                            "description": "Signed exchange signature date.",
                            "type": "integer"
                        },
                        {
                            "name": "expires",
                            "description": "Signed exchange signature expires.",
                            "type": "integer"
                        },
                        {
                            "name": "certificates",
                            "description": "The encoded certificates.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                },
                {
                    "id": "SignedExchangeHeader",
                    "description": "Information about a signed exchange header.\nhttps://wicg.github.io/webpackage/draft-yasskin-httpbis-origin-signed-exchanges-impl.html#cbor-representation",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "requestUrl",
                            "description": "Signed exchange request URL.",
                            "type": "string"
                        },
                        {
                            "name": "requestMethod",
                            "description": "Signed exchange request method.",
                            "type": "string"
                        },
                        {
                            "name": "responseCode",
                            "description": "Signed exchange response code.",
                            "type": "integer"
                        },
                        {
                            "name": "responseHeaders",
                            "description": "Signed exchange response headers.",
                            "$ref": "Headers"
                        },
                        {
                            "name": "signatures",
                            "description": "Signed exchange response signature.",
                            "type": "array",
                            "items": {
                                "$ref": "SignedExchangeSignature"
                            }
                        }
                    ]
                },
                {
                    "id": "SignedExchangeErrorField",
                    "description": "Field type for a signed exchange related error.",
                    "experimental": true,
                    "type": "string",
                    "enum": [
                        "signatureSig",
                        "signatureIntegrity",
                        "signatureCertUrl",
                        "signatureCertSha256",
                        "signatureValidityUrl",
                        "signatureTimestamps"
                    ]
                },
                {
                    "id": "SignedExchangeError",
                    "description": "Information about a signed exchange response.",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "message",
                            "description": "Error message.",
                            "type": "string"
                        },
                        {
                            "name": "signatureIndex",
                            "description": "The index of the signature which caused the error.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "errorField",
                            "description": "The field which caused the error.",
                            "optional": true,
                            "$ref": "SignedExchangeErrorField"
                        }
                    ]
                },
                {
                    "id": "SignedExchangeInfo",
                    "description": "Information about a signed exchange response.",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "outerResponse",
                            "description": "The outer response of signed HTTP exchange which was received from network.",
                            "$ref": "Response"
                        },
                        {
                            "name": "header",
                            "description": "Information about the signed exchange header.",
                            "optional": true,
                            "$ref": "SignedExchangeHeader"
                        },
                        {
                            "name": "securityDetails",
                            "description": "Security details for the signed exchange header.",
                            "optional": true,
                            "$ref": "SecurityDetails"
                        },
                        {
                            "name": "errors",
                            "description": "Errors occurred while handling the signed exchagne.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "SignedExchangeError"
                            }
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "canClearBrowserCache",
                    "description": "Tells whether clearing browser cache is supported.",
                    "deprecated": true,
                    "returns": [
                        {
                            "name": "result",
                            "description": "True if browser cache can be cleared.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "canClearBrowserCookies",
                    "description": "Tells whether clearing browser cookies is supported.",
                    "deprecated": true,
                    "returns": [
                        {
                            "name": "result",
                            "description": "True if browser cookies can be cleared.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "canEmulateNetworkConditions",
                    "description": "Tells whether emulation of network conditions is supported.",
                    "deprecated": true,
                    "returns": [
                        {
                            "name": "result",
                            "description": "True if emulation of network conditions is supported.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "clearBrowserCache",
                    "description": "Clears browser cache."
                },
                {
                    "name": "clearBrowserCookies",
                    "description": "Clears browser cookies."
                },
                {
                    "name": "continueInterceptedRequest",
                    "description": "Response to Network.requestIntercepted which either modifies the request to continue with any\nmodifications, or blocks it, or completes it with the provided response bytes. If a network\nfetch occurs as a result which encounters a redirect an additional Network.requestIntercepted\nevent will be sent with the same InterceptionId.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "interceptionId",
                            "$ref": "InterceptionId"
                        },
                        {
                            "name": "errorReason",
                            "description": "If set this causes the request to fail with the given reason. Passing `Aborted` for requests\nmarked with `isNavigationRequest` also cancels the navigation. Must not be set in response\nto an authChallenge.",
                            "optional": true,
                            "$ref": "ErrorReason"
                        },
                        {
                            "name": "rawResponse",
                            "description": "If set the requests completes using with the provided base64 encoded raw response, including\nHTTP status line and headers etc... Must not be set in response to an authChallenge.",
                            "optional": true,
                            "type": "binary"
                        },
                        {
                            "name": "url",
                            "description": "If set the request url will be modified in a way that's not observable by page. Must not be\nset in response to an authChallenge.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "method",
                            "description": "If set this allows the request method to be overridden. Must not be set in response to an\nauthChallenge.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "postData",
                            "description": "If set this allows postData to be set. Must not be set in response to an authChallenge.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "headers",
                            "description": "If set this allows the request headers to be changed. Must not be set in response to an\nauthChallenge.",
                            "optional": true,
                            "$ref": "Headers"
                        },
                        {
                            "name": "authChallengeResponse",
                            "description": "Response to a requestIntercepted with an authChallenge. Must not be set otherwise.",
                            "optional": true,
                            "$ref": "AuthChallengeResponse"
                        }
                    ]
                },
                {
                    "name": "deleteCookies",
                    "description": "Deletes browser cookies with matching name and url or domain/path pair.",
                    "parameters": [
                        {
                            "name": "name",
                            "description": "Name of the cookies to remove.",
                            "type": "string"
                        },
                        {
                            "name": "url",
                            "description": "If specified, deletes all the cookies with the given name where domain and path match\nprovided URL.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "domain",
                            "description": "If specified, deletes only cookies with the exact domain.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "path",
                            "description": "If specified, deletes only cookies with the exact path.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "disable",
                    "description": "Disables network tracking, prevents network events from being sent to the client."
                },
                {
                    "name": "emulateNetworkConditions",
                    "description": "Activates emulation of network conditions.",
                    "parameters": [
                        {
                            "name": "offline",
                            "description": "True to emulate internet disconnection.",
                            "type": "boolean"
                        },
                        {
                            "name": "latency",
                            "description": "Minimum latency from request sent to response headers received (ms).",
                            "type": "number"
                        },
                        {
                            "name": "downloadThroughput",
                            "description": "Maximal aggregated download throughput (bytes/sec). -1 disables download throttling.",
                            "type": "number"
                        },
                        {
                            "name": "uploadThroughput",
                            "description": "Maximal aggregated upload throughput (bytes/sec).  -1 disables upload throttling.",
                            "type": "number"
                        },
                        {
                            "name": "connectionType",
                            "description": "Connection type if known.",
                            "optional": true,
                            "$ref": "ConnectionType"
                        }
                    ]
                },
                {
                    "name": "enable",
                    "description": "Enables network tracking, network events will now be delivered to the client.",
                    "parameters": [
                        {
                            "name": "maxTotalBufferSize",
                            "description": "Buffer size in bytes to use when preserving network payloads (XHRs, etc).",
                            "experimental": true,
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "maxResourceBufferSize",
                            "description": "Per-resource buffer size in bytes to use when preserving network payloads (XHRs, etc).",
                            "experimental": true,
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "maxPostDataSize",
                            "description": "Longest post body size (in bytes) that would be included in requestWillBeSent notification",
                            "optional": true,
                            "type": "integer"
                        }
                    ]
                },
                {
                    "name": "getAllCookies",
                    "description": "Returns all browser cookies. Depending on the backend support, will return detailed cookie\ninformation in the `cookies` field.",
                    "returns": [
                        {
                            "name": "cookies",
                            "description": "Array of cookie objects.",
                            "type": "array",
                            "items": {
                                "$ref": "Cookie"
                            }
                        }
                    ]
                },
                {
                    "name": "getCertificate",
                    "description": "Returns the DER-encoded certificate.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "origin",
                            "description": "Origin to get certificate for.",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "tableNames",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                },
                {
                    "name": "getCookies",
                    "description": "Returns all browser cookies for the current URL. Depending on the backend support, will return\ndetailed cookie information in the `cookies` field.",
                    "parameters": [
                        {
                            "name": "urls",
                            "description": "The list of URLs for which applicable cookies will be fetched",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ],
                    "returns": [
                        {
                            "name": "cookies",
                            "description": "Array of cookie objects.",
                            "type": "array",
                            "items": {
                                "$ref": "Cookie"
                            }
                        }
                    ]
                },
                {
                    "name": "getResponseBody",
                    "description": "Returns content served for the given request.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Identifier of the network request to get content for.",
                            "$ref": "RequestId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "body",
                            "description": "Response body.",
                            "type": "string"
                        },
                        {
                            "name": "base64Encoded",
                            "description": "True, if content was sent as base64.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "getRequestPostData",
                    "description": "Returns post data sent with the request. Returns an error when no data was sent with the request.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Identifier of the network request to get content for.",
                            "$ref": "RequestId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "postData",
                            "description": "Base64-encoded request body.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "getResponseBodyForInterception",
                    "description": "Returns content served for the given currently intercepted request.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "interceptionId",
                            "description": "Identifier for the intercepted request to get body for.",
                            "$ref": "InterceptionId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "body",
                            "description": "Response body.",
                            "type": "string"
                        },
                        {
                            "name": "base64Encoded",
                            "description": "True, if content was sent as base64.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "takeResponseBodyForInterceptionAsStream",
                    "description": "Returns a handle to the stream representing the response body. Note that after this command,\nthe intercepted request can't be continued as is -- you either need to cancel it or to provide\nthe response body. The stream only supports sequential read, IO.read will fail if the position\nis specified.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "interceptionId",
                            "$ref": "InterceptionId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "stream",
                            "$ref": "IO.StreamHandle"
                        }
                    ]
                },
                {
                    "name": "replayXHR",
                    "description": "This method sends a new XMLHttpRequest which is identical to the original one. The following\nparameters should be identical: method, url, async, request body, extra headers, withCredentials\nattribute, user, password.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Identifier of XHR to replay.",
                            "$ref": "RequestId"
                        }
                    ]
                },
                {
                    "name": "searchInResponseBody",
                    "description": "Searches for given string in response content.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Identifier of the network response to search.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "query",
                            "description": "String to search for.",
                            "type": "string"
                        },
                        {
                            "name": "caseSensitive",
                            "description": "If true, search is case sensitive.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "isRegex",
                            "description": "If true, treats string parameter as regex.",
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "result",
                            "description": "List of search matches.",
                            "type": "array",
                            "items": {
                                "$ref": "Debugger.SearchMatch"
                            }
                        }
                    ]
                },
                {
                    "name": "setBlockedURLs",
                    "description": "Blocks URLs from loading.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "urls",
                            "description": "URL patterns to block. Wildcards ('*') are allowed.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                },
                {
                    "name": "setBypassServiceWorker",
                    "description": "Toggles ignoring of service worker for each request.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "bypass",
                            "description": "Bypass service worker and load from network.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setCacheDisabled",
                    "description": "Toggles ignoring cache for each request. If `true`, cache will not be used.",
                    "parameters": [
                        {
                            "name": "cacheDisabled",
                            "description": "Cache disabled state.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setCookie",
                    "description": "Sets a cookie with the given cookie data; may overwrite equivalent cookies if they exist.",
                    "parameters": [
                        {
                            "name": "name",
                            "description": "Cookie name.",
                            "type": "string"
                        },
                        {
                            "name": "value",
                            "description": "Cookie value.",
                            "type": "string"
                        },
                        {
                            "name": "url",
                            "description": "The request-URI to associate with the setting of the cookie. This value can affect the\ndefault domain and path values of the created cookie.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "domain",
                            "description": "Cookie domain.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "path",
                            "description": "Cookie path.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "secure",
                            "description": "True if cookie is secure.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "httpOnly",
                            "description": "True if cookie is http-only.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "sameSite",
                            "description": "Cookie SameSite type.",
                            "optional": true,
                            "$ref": "CookieSameSite"
                        },
                        {
                            "name": "expires",
                            "description": "Cookie expiration date, session cookie if not set",
                            "optional": true,
                            "$ref": "TimeSinceEpoch"
                        }
                    ],
                    "returns": [
                        {
                            "name": "success",
                            "description": "True if successfully set cookie.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setCookies",
                    "description": "Sets given cookies.",
                    "parameters": [
                        {
                            "name": "cookies",
                            "description": "Cookies to be set.",
                            "type": "array",
                            "items": {
                                "$ref": "CookieParam"
                            }
                        }
                    ]
                },
                {
                    "name": "setDataSizeLimitsForTest",
                    "description": "For testing.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "maxTotalSize",
                            "description": "Maximum total buffer size.",
                            "type": "integer"
                        },
                        {
                            "name": "maxResourceSize",
                            "description": "Maximum per-resource size.",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "name": "setExtraHTTPHeaders",
                    "description": "Specifies whether to always send extra HTTP headers with the requests from this page.",
                    "parameters": [
                        {
                            "name": "headers",
                            "description": "Map with extra HTTP headers.",
                            "$ref": "Headers"
                        }
                    ]
                },
                {
                    "name": "setRequestInterception",
                    "description": "Sets the requests to intercept that match a the provided patterns and optionally resource types.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "patterns",
                            "description": "Requests matching any of these patterns will be forwarded and wait for the corresponding\ncontinueInterceptedRequest call.",
                            "type": "array",
                            "items": {
                                "$ref": "RequestPattern"
                            }
                        }
                    ]
                },
                {
                    "name": "setUserAgentOverride",
                    "description": "Allows overriding user agent with the given string.",
                    "redirect": "Emulation",
                    "parameters": [
                        {
                            "name": "userAgent",
                            "description": "User agent to use.",
                            "type": "string"
                        },
                        {
                            "name": "acceptLanguage",
                            "description": "Browser langugage to emulate.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "platform",
                            "description": "The platform navigator.platform should return.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "dataReceived",
                    "description": "Fired when data chunk was received over the network.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Request identifier.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "timestamp",
                            "description": "Timestamp.",
                            "$ref": "MonotonicTime"
                        },
                        {
                            "name": "dataLength",
                            "description": "Data chunk length.",
                            "type": "integer"
                        },
                        {
                            "name": "encodedDataLength",
                            "description": "Actual bytes received (might be less than dataLength for compressed encodings).",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "name": "eventSourceMessageReceived",
                    "description": "Fired when EventSource message is received.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Request identifier.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "timestamp",
                            "description": "Timestamp.",
                            "$ref": "MonotonicTime"
                        },
                        {
                            "name": "eventName",
                            "description": "Message type.",
                            "type": "string"
                        },
                        {
                            "name": "eventId",
                            "description": "Message identifier.",
                            "type": "string"
                        },
                        {
                            "name": "data",
                            "description": "Message content.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "loadingFailed",
                    "description": "Fired when HTTP request has failed to load.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Request identifier.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "timestamp",
                            "description": "Timestamp.",
                            "$ref": "MonotonicTime"
                        },
                        {
                            "name": "type",
                            "description": "Resource type.",
                            "$ref": "ResourceType"
                        },
                        {
                            "name": "errorText",
                            "description": "User friendly error message.",
                            "type": "string"
                        },
                        {
                            "name": "canceled",
                            "description": "True if loading was canceled.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "blockedReason",
                            "description": "The reason why loading was blocked, if any.",
                            "optional": true,
                            "$ref": "BlockedReason"
                        }
                    ]
                },
                {
                    "name": "loadingFinished",
                    "description": "Fired when HTTP request has finished loading.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Request identifier.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "timestamp",
                            "description": "Timestamp.",
                            "$ref": "MonotonicTime"
                        },
                        {
                            "name": "encodedDataLength",
                            "description": "Total number of bytes received for this request.",
                            "type": "number"
                        },
                        {
                            "name": "shouldReportCorbBlocking",
                            "description": "Set when 1) response was blocked by Cross-Origin Read Blocking and also\n2) this needs to be reported to the DevTools console.",
                            "optional": true,
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "requestIntercepted",
                    "description": "Details of an intercepted HTTP request, which must be either allowed, blocked, modified or\nmocked.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "interceptionId",
                            "description": "Each request the page makes will have a unique id, however if any redirects are encountered\nwhile processing that fetch, they will be reported with the same id as the original fetch.\nLikewise if HTTP authentication is needed then the same fetch id will be used.",
                            "$ref": "InterceptionId"
                        },
                        {
                            "name": "request",
                            "$ref": "Request"
                        },
                        {
                            "name": "frameId",
                            "description": "The id of the frame that initiated the request.",
                            "$ref": "Page.FrameId"
                        },
                        {
                            "name": "resourceType",
                            "description": "How the requested resource will be used.",
                            "$ref": "ResourceType"
                        },
                        {
                            "name": "isNavigationRequest",
                            "description": "Whether this is a navigation request, which can abort the navigation completely.",
                            "type": "boolean"
                        },
                        {
                            "name": "isDownload",
                            "description": "Set if the request is a navigation that will result in a download.\nOnly present after response is received from the server (i.e. HeadersReceived stage).",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "redirectUrl",
                            "description": "Redirect location, only sent if a redirect was intercepted.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "authChallenge",
                            "description": "Details of the Authorization Challenge encountered. If this is set then\ncontinueInterceptedRequest must contain an authChallengeResponse.",
                            "optional": true,
                            "$ref": "AuthChallenge"
                        },
                        {
                            "name": "responseErrorReason",
                            "description": "Response error if intercepted at response stage or if redirect occurred while intercepting\nrequest.",
                            "optional": true,
                            "$ref": "ErrorReason"
                        },
                        {
                            "name": "responseStatusCode",
                            "description": "Response code if intercepted at response stage or if redirect occurred while intercepting\nrequest or auth retry occurred.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "responseHeaders",
                            "description": "Response headers if intercepted at the response stage or if redirect occurred while\nintercepting request or auth retry occurred.",
                            "optional": true,
                            "$ref": "Headers"
                        }
                    ]
                },
                {
                    "name": "requestServedFromCache",
                    "description": "Fired if request ended up loading from cache.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Request identifier.",
                            "$ref": "RequestId"
                        }
                    ]
                },
                {
                    "name": "requestWillBeSent",
                    "description": "Fired when page is about to send HTTP request.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Request identifier.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "loaderId",
                            "description": "Loader identifier. Empty string if the request is fetched from worker.",
                            "$ref": "LoaderId"
                        },
                        {
                            "name": "documentURL",
                            "description": "URL of the document this request is loaded for.",
                            "type": "string"
                        },
                        {
                            "name": "request",
                            "description": "Request data.",
                            "$ref": "Request"
                        },
                        {
                            "name": "timestamp",
                            "description": "Timestamp.",
                            "$ref": "MonotonicTime"
                        },
                        {
                            "name": "wallTime",
                            "description": "Timestamp.",
                            "$ref": "TimeSinceEpoch"
                        },
                        {
                            "name": "initiator",
                            "description": "Request initiator.",
                            "$ref": "Initiator"
                        },
                        {
                            "name": "redirectResponse",
                            "description": "Redirect response data.",
                            "optional": true,
                            "$ref": "Response"
                        },
                        {
                            "name": "type",
                            "description": "Type of this resource.",
                            "optional": true,
                            "$ref": "ResourceType"
                        },
                        {
                            "name": "frameId",
                            "description": "Frame identifier.",
                            "optional": true,
                            "$ref": "Page.FrameId"
                        },
                        {
                            "name": "hasUserGesture",
                            "description": "Whether the request is initiated by a user gesture. Defaults to false.",
                            "optional": true,
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "resourceChangedPriority",
                    "description": "Fired when resource loading priority is changed",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Request identifier.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "newPriority",
                            "description": "New priority",
                            "$ref": "ResourcePriority"
                        },
                        {
                            "name": "timestamp",
                            "description": "Timestamp.",
                            "$ref": "MonotonicTime"
                        }
                    ]
                },
                {
                    "name": "signedExchangeReceived",
                    "description": "Fired when a signed exchange was received over the network",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Request identifier.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "info",
                            "description": "Information about the signed exchange response.",
                            "$ref": "SignedExchangeInfo"
                        }
                    ]
                },
                {
                    "name": "responseReceived",
                    "description": "Fired when HTTP response is available.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Request identifier.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "loaderId",
                            "description": "Loader identifier. Empty string if the request is fetched from worker.",
                            "$ref": "LoaderId"
                        },
                        {
                            "name": "timestamp",
                            "description": "Timestamp.",
                            "$ref": "MonotonicTime"
                        },
                        {
                            "name": "type",
                            "description": "Resource type.",
                            "$ref": "ResourceType"
                        },
                        {
                            "name": "response",
                            "description": "Response data.",
                            "$ref": "Response"
                        },
                        {
                            "name": "frameId",
                            "description": "Frame identifier.",
                            "optional": true,
                            "$ref": "Page.FrameId"
                        }
                    ]
                },
                {
                    "name": "webSocketClosed",
                    "description": "Fired when WebSocket is closed.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Request identifier.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "timestamp",
                            "description": "Timestamp.",
                            "$ref": "MonotonicTime"
                        }
                    ]
                },
                {
                    "name": "webSocketCreated",
                    "description": "Fired upon WebSocket creation.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Request identifier.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "url",
                            "description": "WebSocket request URL.",
                            "type": "string"
                        },
                        {
                            "name": "initiator",
                            "description": "Request initiator.",
                            "optional": true,
                            "$ref": "Initiator"
                        }
                    ]
                },
                {
                    "name": "webSocketFrameError",
                    "description": "Fired when WebSocket frame error occurs.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Request identifier.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "timestamp",
                            "description": "Timestamp.",
                            "$ref": "MonotonicTime"
                        },
                        {
                            "name": "errorMessage",
                            "description": "WebSocket frame error message.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "webSocketFrameReceived",
                    "description": "Fired when WebSocket frame is received.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Request identifier.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "timestamp",
                            "description": "Timestamp.",
                            "$ref": "MonotonicTime"
                        },
                        {
                            "name": "response",
                            "description": "WebSocket response data.",
                            "$ref": "WebSocketFrame"
                        }
                    ]
                },
                {
                    "name": "webSocketFrameSent",
                    "description": "Fired when WebSocket frame is sent.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Request identifier.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "timestamp",
                            "description": "Timestamp.",
                            "$ref": "MonotonicTime"
                        },
                        {
                            "name": "response",
                            "description": "WebSocket response data.",
                            "$ref": "WebSocketFrame"
                        }
                    ]
                },
                {
                    "name": "webSocketHandshakeResponseReceived",
                    "description": "Fired when WebSocket handshake response becomes available.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Request identifier.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "timestamp",
                            "description": "Timestamp.",
                            "$ref": "MonotonicTime"
                        },
                        {
                            "name": "response",
                            "description": "WebSocket response data.",
                            "$ref": "WebSocketResponse"
                        }
                    ]
                },
                {
                    "name": "webSocketWillSendHandshakeRequest",
                    "description": "Fired when WebSocket is about to initiate handshake.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Request identifier.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "timestamp",
                            "description": "Timestamp.",
                            "$ref": "MonotonicTime"
                        },
                        {
                            "name": "wallTime",
                            "description": "UTC Timestamp.",
                            "$ref": "TimeSinceEpoch"
                        },
                        {
                            "name": "request",
                            "description": "WebSocket request data.",
                            "$ref": "WebSocketRequest"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Overlay",
            "description": "This domain provides various functionality related to drawing atop the inspected page.",
            "experimental": true,
            "dependencies": [
                "DOM",
                "Page",
                "Runtime"
            ],
            "types": [
                {
                    "id": "HighlightConfig",
                    "description": "Configuration data for the highlighting of page elements.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "showInfo",
                            "description": "Whether the node info tooltip should be shown (default: false).",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "showRulers",
                            "description": "Whether the rulers should be shown (default: false).",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "showExtensionLines",
                            "description": "Whether the extension lines from node to the rulers should be shown (default: false).",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "displayAsMaterial",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "contentColor",
                            "description": "The content box highlight fill color (default: transparent).",
                            "optional": true,
                            "$ref": "DOM.RGBA"
                        },
                        {
                            "name": "paddingColor",
                            "description": "The padding highlight fill color (default: transparent).",
                            "optional": true,
                            "$ref": "DOM.RGBA"
                        },
                        {
                            "name": "borderColor",
                            "description": "The border highlight fill color (default: transparent).",
                            "optional": true,
                            "$ref": "DOM.RGBA"
                        },
                        {
                            "name": "marginColor",
                            "description": "The margin highlight fill color (default: transparent).",
                            "optional": true,
                            "$ref": "DOM.RGBA"
                        },
                        {
                            "name": "eventTargetColor",
                            "description": "The event target element highlight fill color (default: transparent).",
                            "optional": true,
                            "$ref": "DOM.RGBA"
                        },
                        {
                            "name": "shapeColor",
                            "description": "The shape outside fill color (default: transparent).",
                            "optional": true,
                            "$ref": "DOM.RGBA"
                        },
                        {
                            "name": "shapeMarginColor",
                            "description": "The shape margin fill color (default: transparent).",
                            "optional": true,
                            "$ref": "DOM.RGBA"
                        },
                        {
                            "name": "selectorList",
                            "description": "Selectors to highlight relevant nodes.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "cssGridColor",
                            "description": "The grid layout color (default: transparent).",
                            "optional": true,
                            "$ref": "DOM.RGBA"
                        }
                    ]
                },
                {
                    "id": "InspectMode",
                    "type": "string",
                    "enum": [
                        "searchForNode",
                        "searchForUAShadowDOM",
                        "none"
                    ]
                }
            ],
            "commands": [
                {
                    "name": "disable",
                    "description": "Disables domain notifications."
                },
                {
                    "name": "enable",
                    "description": "Enables domain notifications."
                },
                {
                    "name": "getHighlightObjectForTest",
                    "description": "For testing.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "description": "Id of the node to get highlight object for.",
                            "$ref": "DOM.NodeId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "highlight",
                            "description": "Highlight data for the node.",
                            "type": "object"
                        }
                    ]
                },
                {
                    "name": "hideHighlight",
                    "description": "Hides any highlight."
                },
                {
                    "name": "highlightFrame",
                    "description": "Highlights owner element of the frame with given id.",
                    "parameters": [
                        {
                            "name": "frameId",
                            "description": "Identifier of the frame to highlight.",
                            "$ref": "Page.FrameId"
                        },
                        {
                            "name": "contentColor",
                            "description": "The content box highlight fill color (default: transparent).",
                            "optional": true,
                            "$ref": "DOM.RGBA"
                        },
                        {
                            "name": "contentOutlineColor",
                            "description": "The content box highlight outline color (default: transparent).",
                            "optional": true,
                            "$ref": "DOM.RGBA"
                        }
                    ]
                },
                {
                    "name": "highlightNode",
                    "description": "Highlights DOM node with given id or with the given JavaScript object wrapper. Either nodeId or\nobjectId must be specified.",
                    "parameters": [
                        {
                            "name": "highlightConfig",
                            "description": "A descriptor for the highlight appearance.",
                            "$ref": "HighlightConfig"
                        },
                        {
                            "name": "nodeId",
                            "description": "Identifier of the node to highlight.",
                            "optional": true,
                            "$ref": "DOM.NodeId"
                        },
                        {
                            "name": "backendNodeId",
                            "description": "Identifier of the backend node to highlight.",
                            "optional": true,
                            "$ref": "DOM.BackendNodeId"
                        },
                        {
                            "name": "objectId",
                            "description": "JavaScript object id of the node to be highlighted.",
                            "optional": true,
                            "$ref": "Runtime.RemoteObjectId"
                        }
                    ]
                },
                {
                    "name": "highlightQuad",
                    "description": "Highlights given quad. Coordinates are absolute with respect to the main frame viewport.",
                    "parameters": [
                        {
                            "name": "quad",
                            "description": "Quad to highlight",
                            "$ref": "DOM.Quad"
                        },
                        {
                            "name": "color",
                            "description": "The highlight fill color (default: transparent).",
                            "optional": true,
                            "$ref": "DOM.RGBA"
                        },
                        {
                            "name": "outlineColor",
                            "description": "The highlight outline color (default: transparent).",
                            "optional": true,
                            "$ref": "DOM.RGBA"
                        }
                    ]
                },
                {
                    "name": "highlightRect",
                    "description": "Highlights given rectangle. Coordinates are absolute with respect to the main frame viewport.",
                    "parameters": [
                        {
                            "name": "x",
                            "description": "X coordinate",
                            "type": "integer"
                        },
                        {
                            "name": "y",
                            "description": "Y coordinate",
                            "type": "integer"
                        },
                        {
                            "name": "width",
                            "description": "Rectangle width",
                            "type": "integer"
                        },
                        {
                            "name": "height",
                            "description": "Rectangle height",
                            "type": "integer"
                        },
                        {
                            "name": "color",
                            "description": "The highlight fill color (default: transparent).",
                            "optional": true,
                            "$ref": "DOM.RGBA"
                        },
                        {
                            "name": "outlineColor",
                            "description": "The highlight outline color (default: transparent).",
                            "optional": true,
                            "$ref": "DOM.RGBA"
                        }
                    ]
                },
                {
                    "name": "setInspectMode",
                    "description": "Enters the 'inspect' mode. In this mode, elements that user is hovering over are highlighted.\nBackend then generates 'inspectNodeRequested' event upon element selection.",
                    "parameters": [
                        {
                            "name": "mode",
                            "description": "Set an inspection mode.",
                            "$ref": "InspectMode"
                        },
                        {
                            "name": "highlightConfig",
                            "description": "A descriptor for the highlight appearance of hovered-over nodes. May be omitted if `enabled\n== false`.",
                            "optional": true,
                            "$ref": "HighlightConfig"
                        }
                    ]
                },
                {
                    "name": "setPausedInDebuggerMessage",
                    "parameters": [
                        {
                            "name": "message",
                            "description": "The message to display, also triggers resume and step over controls.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "setShowDebugBorders",
                    "description": "Requests that backend shows debug borders on layers",
                    "parameters": [
                        {
                            "name": "show",
                            "description": "True for showing debug borders",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setShowFPSCounter",
                    "description": "Requests that backend shows the FPS counter",
                    "parameters": [
                        {
                            "name": "show",
                            "description": "True for showing the FPS counter",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setShowPaintRects",
                    "description": "Requests that backend shows paint rectangles",
                    "parameters": [
                        {
                            "name": "result",
                            "description": "True for showing paint rectangles",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setShowScrollBottleneckRects",
                    "description": "Requests that backend shows scroll bottleneck rects",
                    "parameters": [
                        {
                            "name": "show",
                            "description": "True for showing scroll bottleneck rects",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setShowHitTestBorders",
                    "description": "Requests that backend shows hit-test borders on layers",
                    "parameters": [
                        {
                            "name": "show",
                            "description": "True for showing hit-test borders",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setShowViewportSizeOnResize",
                    "description": "Paints viewport size upon main frame resize.",
                    "parameters": [
                        {
                            "name": "show",
                            "description": "Whether to paint size or not.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setSuspended",
                    "parameters": [
                        {
                            "name": "suspended",
                            "description": "Whether overlay should be suspended and not consume any resources until resumed.",
                            "type": "boolean"
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "inspectNodeRequested",
                    "description": "Fired when the node should be inspected. This happens after call to `setInspectMode` or when\nuser manually inspects an element.",
                    "parameters": [
                        {
                            "name": "backendNodeId",
                            "description": "Id of the node to inspect.",
                            "$ref": "DOM.BackendNodeId"
                        }
                    ]
                },
                {
                    "name": "nodeHighlightRequested",
                    "description": "Fired when the node should be highlighted. This happens after call to `setInspectMode`.",
                    "parameters": [
                        {
                            "name": "nodeId",
                            "$ref": "DOM.NodeId"
                        }
                    ]
                },
                {
                    "name": "screenshotRequested",
                    "description": "Fired when user asks to capture screenshot of some area on the page.",
                    "parameters": [
                        {
                            "name": "viewport",
                            "description": "Viewport to capture, in CSS.",
                            "$ref": "Page.Viewport"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Page",
            "description": "Actions and events related to the inspected page belong to the page domain.",
            "dependencies": [
                "Debugger",
                "DOM",
                "Network",
                "Runtime"
            ],
            "types": [
                {
                    "id": "FrameId",
                    "description": "Unique frame identifier.",
                    "type": "string"
                },
                {
                    "id": "Frame",
                    "description": "Information about the Frame on the page.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "id",
                            "description": "Frame unique identifier.",
                            "type": "string"
                        },
                        {
                            "name": "parentId",
                            "description": "Parent frame identifier.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "loaderId",
                            "description": "Identifier of the loader associated with this frame.",
                            "$ref": "Network.LoaderId"
                        },
                        {
                            "name": "name",
                            "description": "Frame's name as specified in the tag.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "url",
                            "description": "Frame document's URL.",
                            "type": "string"
                        },
                        {
                            "name": "securityOrigin",
                            "description": "Frame document's security origin.",
                            "type": "string"
                        },
                        {
                            "name": "mimeType",
                            "description": "Frame document's mimeType as determined by the browser.",
                            "type": "string"
                        },
                        {
                            "name": "unreachableUrl",
                            "description": "If the frame failed to load, this contains the URL that could not be loaded.",
                            "experimental": true,
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "FrameResource",
                    "description": "Information about the Resource on the page.",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "url",
                            "description": "Resource URL.",
                            "type": "string"
                        },
                        {
                            "name": "type",
                            "description": "Type of this resource.",
                            "$ref": "Network.ResourceType"
                        },
                        {
                            "name": "mimeType",
                            "description": "Resource mimeType as determined by the browser.",
                            "type": "string"
                        },
                        {
                            "name": "lastModified",
                            "description": "last-modified timestamp as reported by server.",
                            "optional": true,
                            "$ref": "Network.TimeSinceEpoch"
                        },
                        {
                            "name": "contentSize",
                            "description": "Resource content size.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "failed",
                            "description": "True if the resource failed to load.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "canceled",
                            "description": "True if the resource was canceled during loading.",
                            "optional": true,
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "id": "FrameResourceTree",
                    "description": "Information about the Frame hierarchy along with their cached resources.",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "frame",
                            "description": "Frame information for this tree item.",
                            "$ref": "Frame"
                        },
                        {
                            "name": "childFrames",
                            "description": "Child frames.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "FrameResourceTree"
                            }
                        },
                        {
                            "name": "resources",
                            "description": "Information about frame resources.",
                            "type": "array",
                            "items": {
                                "$ref": "FrameResource"
                            }
                        }
                    ]
                },
                {
                    "id": "FrameTree",
                    "description": "Information about the Frame hierarchy.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "frame",
                            "description": "Frame information for this tree item.",
                            "$ref": "Frame"
                        },
                        {
                            "name": "childFrames",
                            "description": "Child frames.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "FrameTree"
                            }
                        }
                    ]
                },
                {
                    "id": "ScriptIdentifier",
                    "description": "Unique script identifier.",
                    "type": "string"
                },
                {
                    "id": "TransitionType",
                    "description": "Transition type.",
                    "type": "string",
                    "enum": [
                        "link",
                        "typed",
                        "address_bar",
                        "auto_bookmark",
                        "auto_subframe",
                        "manual_subframe",
                        "generated",
                        "auto_toplevel",
                        "form_submit",
                        "reload",
                        "keyword",
                        "keyword_generated",
                        "other"
                    ]
                },
                {
                    "id": "NavigationEntry",
                    "description": "Navigation history entry.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "id",
                            "description": "Unique id of the navigation history entry.",
                            "type": "integer"
                        },
                        {
                            "name": "url",
                            "description": "URL of the navigation history entry.",
                            "type": "string"
                        },
                        {
                            "name": "userTypedURL",
                            "description": "URL that the user typed in the url bar.",
                            "type": "string"
                        },
                        {
                            "name": "title",
                            "description": "Title of the navigation history entry.",
                            "type": "string"
                        },
                        {
                            "name": "transitionType",
                            "description": "Transition type.",
                            "$ref": "TransitionType"
                        }
                    ]
                },
                {
                    "id": "ScreencastFrameMetadata",
                    "description": "Screencast frame metadata.",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "offsetTop",
                            "description": "Top offset in DIP.",
                            "type": "number"
                        },
                        {
                            "name": "pageScaleFactor",
                            "description": "Page scale factor.",
                            "type": "number"
                        },
                        {
                            "name": "deviceWidth",
                            "description": "Device screen width in DIP.",
                            "type": "number"
                        },
                        {
                            "name": "deviceHeight",
                            "description": "Device screen height in DIP.",
                            "type": "number"
                        },
                        {
                            "name": "scrollOffsetX",
                            "description": "Position of horizontal scroll in CSS pixels.",
                            "type": "number"
                        },
                        {
                            "name": "scrollOffsetY",
                            "description": "Position of vertical scroll in CSS pixels.",
                            "type": "number"
                        },
                        {
                            "name": "timestamp",
                            "description": "Frame swap timestamp.",
                            "optional": true,
                            "$ref": "Network.TimeSinceEpoch"
                        }
                    ]
                },
                {
                    "id": "DialogType",
                    "description": "Javascript dialog type.",
                    "type": "string",
                    "enum": [
                        "alert",
                        "confirm",
                        "prompt",
                        "beforeunload"
                    ]
                },
                {
                    "id": "AppManifestError",
                    "description": "Error while paring app manifest.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "message",
                            "description": "Error message.",
                            "type": "string"
                        },
                        {
                            "name": "critical",
                            "description": "If criticial, this is a non-recoverable parse error.",
                            "type": "integer"
                        },
                        {
                            "name": "line",
                            "description": "Error line.",
                            "type": "integer"
                        },
                        {
                            "name": "column",
                            "description": "Error column.",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "id": "LayoutViewport",
                    "description": "Layout viewport position and dimensions.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "pageX",
                            "description": "Horizontal offset relative to the document (CSS pixels).",
                            "type": "integer"
                        },
                        {
                            "name": "pageY",
                            "description": "Vertical offset relative to the document (CSS pixels).",
                            "type": "integer"
                        },
                        {
                            "name": "clientWidth",
                            "description": "Width (CSS pixels), excludes scrollbar if present.",
                            "type": "integer"
                        },
                        {
                            "name": "clientHeight",
                            "description": "Height (CSS pixels), excludes scrollbar if present.",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "id": "VisualViewport",
                    "description": "Visual viewport position, dimensions, and scale.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "offsetX",
                            "description": "Horizontal offset relative to the layout viewport (CSS pixels).",
                            "type": "number"
                        },
                        {
                            "name": "offsetY",
                            "description": "Vertical offset relative to the layout viewport (CSS pixels).",
                            "type": "number"
                        },
                        {
                            "name": "pageX",
                            "description": "Horizontal offset relative to the document (CSS pixels).",
                            "type": "number"
                        },
                        {
                            "name": "pageY",
                            "description": "Vertical offset relative to the document (CSS pixels).",
                            "type": "number"
                        },
                        {
                            "name": "clientWidth",
                            "description": "Width (CSS pixels), excludes scrollbar if present.",
                            "type": "number"
                        },
                        {
                            "name": "clientHeight",
                            "description": "Height (CSS pixels), excludes scrollbar if present.",
                            "type": "number"
                        },
                        {
                            "name": "scale",
                            "description": "Scale relative to the ideal viewport (size at width=device-width).",
                            "type": "number"
                        }
                    ]
                },
                {
                    "id": "Viewport",
                    "description": "Viewport for capturing screenshot.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "x",
                            "description": "X offset in CSS pixels.",
                            "type": "number"
                        },
                        {
                            "name": "y",
                            "description": "Y offset in CSS pixels",
                            "type": "number"
                        },
                        {
                            "name": "width",
                            "description": "Rectangle width in CSS pixels",
                            "type": "number"
                        },
                        {
                            "name": "height",
                            "description": "Rectangle height in CSS pixels",
                            "type": "number"
                        },
                        {
                            "name": "scale",
                            "description": "Page scale factor.",
                            "type": "number"
                        }
                    ]
                },
                {
                    "id": "FontFamilies",
                    "description": "Generic font families collection.",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "standard",
                            "description": "The standard font-family.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "fixed",
                            "description": "The fixed font-family.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "serif",
                            "description": "The serif font-family.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "sansSerif",
                            "description": "The sansSerif font-family.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "cursive",
                            "description": "The cursive font-family.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "fantasy",
                            "description": "The fantasy font-family.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "pictograph",
                            "description": "The pictograph font-family.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "FontSizes",
                    "description": "Default font sizes.",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "standard",
                            "description": "Default standard font size.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "fixed",
                            "description": "Default fixed font size.",
                            "optional": true,
                            "type": "integer"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "addScriptToEvaluateOnLoad",
                    "description": "Deprecated, please use addScriptToEvaluateOnNewDocument instead.",
                    "experimental": true,
                    "deprecated": true,
                    "parameters": [
                        {
                            "name": "scriptSource",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "identifier",
                            "description": "Identifier of the added script.",
                            "$ref": "ScriptIdentifier"
                        }
                    ]
                },
                {
                    "name": "addScriptToEvaluateOnNewDocument",
                    "description": "Evaluates given script in every frame upon creation (before loading frame's scripts).",
                    "parameters": [
                        {
                            "name": "source",
                            "type": "string"
                        },
                        {
                            "name": "worldName",
                            "description": "If specified, creates an isolated world with the given name and evaluates given script in it.\nThis world name will be used as the ExecutionContextDescription::name when the corresponding\nevent is emitted.",
                            "experimental": true,
                            "optional": true,
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "identifier",
                            "description": "Identifier of the added script.",
                            "$ref": "ScriptIdentifier"
                        }
                    ]
                },
                {
                    "name": "bringToFront",
                    "description": "Brings page to front (activates tab)."
                },
                {
                    "name": "captureScreenshot",
                    "description": "Capture page screenshot.",
                    "parameters": [
                        {
                            "name": "format",
                            "description": "Image compression format (defaults to png).",
                            "optional": true,
                            "type": "string",
                            "enum": [
                                "jpeg",
                                "png"
                            ]
                        },
                        {
                            "name": "quality",
                            "description": "Compression quality from range [0..100] (jpeg only).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "clip",
                            "description": "Capture the screenshot of a given region only.",
                            "optional": true,
                            "$ref": "Viewport"
                        },
                        {
                            "name": "fromSurface",
                            "description": "Capture the screenshot from the surface, rather than the view. Defaults to true.",
                            "experimental": true,
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "data",
                            "description": "Base64-encoded image data.",
                            "type": "binary"
                        }
                    ]
                },
                {
                    "name": "captureSnapshot",
                    "description": "Returns a snapshot of the page as a string. For MHTML format, the serialization includes\niframes, shadow DOM, external resources, and element-inline styles.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "format",
                            "description": "Format (defaults to mhtml).",
                            "optional": true,
                            "type": "string",
                            "enum": [
                                "mhtml"
                            ]
                        }
                    ],
                    "returns": [
                        {
                            "name": "data",
                            "description": "Serialized page data.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "clearDeviceMetricsOverride",
                    "description": "Clears the overriden device metrics.",
                    "experimental": true,
                    "deprecated": true,
                    "redirect": "Emulation"
                },
                {
                    "name": "clearDeviceOrientationOverride",
                    "description": "Clears the overridden Device Orientation.",
                    "experimental": true,
                    "deprecated": true,
                    "redirect": "DeviceOrientation"
                },
                {
                    "name": "clearGeolocationOverride",
                    "description": "Clears the overriden Geolocation Position and Error.",
                    "deprecated": true,
                    "redirect": "Emulation"
                },
                {
                    "name": "createIsolatedWorld",
                    "description": "Creates an isolated world for the given frame.",
                    "parameters": [
                        {
                            "name": "frameId",
                            "description": "Id of the frame in which the isolated world should be created.",
                            "$ref": "FrameId"
                        },
                        {
                            "name": "worldName",
                            "description": "An optional name which is reported in the Execution Context.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "grantUniveralAccess",
                            "description": "Whether or not universal access should be granted to the isolated world. This is a powerful\noption, use with caution.",
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "executionContextId",
                            "description": "Execution context of the isolated world.",
                            "$ref": "Runtime.ExecutionContextId"
                        }
                    ]
                },
                {
                    "name": "deleteCookie",
                    "description": "Deletes browser cookie with given name, domain and path.",
                    "experimental": true,
                    "deprecated": true,
                    "redirect": "Network",
                    "parameters": [
                        {
                            "name": "cookieName",
                            "description": "Name of the cookie to remove.",
                            "type": "string"
                        },
                        {
                            "name": "url",
                            "description": "URL to match cooke domain and path.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "disable",
                    "description": "Disables page domain notifications."
                },
                {
                    "name": "enable",
                    "description": "Enables page domain notifications."
                },
                {
                    "name": "getAppManifest",
                    "returns": [
                        {
                            "name": "url",
                            "description": "Manifest location.",
                            "type": "string"
                        },
                        {
                            "name": "errors",
                            "type": "array",
                            "items": {
                                "$ref": "AppManifestError"
                            }
                        },
                        {
                            "name": "data",
                            "description": "Manifest content.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "getCookies",
                    "description": "Returns all browser cookies. Depending on the backend support, will return detailed cookie\ninformation in the `cookies` field.",
                    "experimental": true,
                    "deprecated": true,
                    "redirect": "Network",
                    "returns": [
                        {
                            "name": "cookies",
                            "description": "Array of cookie objects.",
                            "type": "array",
                            "items": {
                                "$ref": "Network.Cookie"
                            }
                        }
                    ]
                },
                {
                    "name": "getFrameTree",
                    "description": "Returns present frame tree structure.",
                    "returns": [
                        {
                            "name": "frameTree",
                            "description": "Present frame tree structure.",
                            "$ref": "FrameTree"
                        }
                    ]
                },
                {
                    "name": "getLayoutMetrics",
                    "description": "Returns metrics relating to the layouting of the page, such as viewport bounds/scale.",
                    "returns": [
                        {
                            "name": "layoutViewport",
                            "description": "Metrics relating to the layout viewport.",
                            "$ref": "LayoutViewport"
                        },
                        {
                            "name": "visualViewport",
                            "description": "Metrics relating to the visual viewport.",
                            "$ref": "VisualViewport"
                        },
                        {
                            "name": "contentSize",
                            "description": "Size of scrollable area.",
                            "$ref": "DOM.Rect"
                        }
                    ]
                },
                {
                    "name": "getNavigationHistory",
                    "description": "Returns navigation history for the current page.",
                    "returns": [
                        {
                            "name": "currentIndex",
                            "description": "Index of the current navigation history entry.",
                            "type": "integer"
                        },
                        {
                            "name": "entries",
                            "description": "Array of navigation history entries.",
                            "type": "array",
                            "items": {
                                "$ref": "NavigationEntry"
                            }
                        }
                    ]
                },
                {
                    "name": "getResourceContent",
                    "description": "Returns content of the given resource.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "frameId",
                            "description": "Frame id to get resource for.",
                            "$ref": "FrameId"
                        },
                        {
                            "name": "url",
                            "description": "URL of the resource to get content for.",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "content",
                            "description": "Resource content.",
                            "type": "string"
                        },
                        {
                            "name": "base64Encoded",
                            "description": "True, if content was served as base64.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "getResourceTree",
                    "description": "Returns present frame / resource tree structure.",
                    "experimental": true,
                    "returns": [
                        {
                            "name": "frameTree",
                            "description": "Present frame / resource tree structure.",
                            "$ref": "FrameResourceTree"
                        }
                    ]
                },
                {
                    "name": "handleJavaScriptDialog",
                    "description": "Accepts or dismisses a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload).",
                    "parameters": [
                        {
                            "name": "accept",
                            "description": "Whether to accept or dismiss the dialog.",
                            "type": "boolean"
                        },
                        {
                            "name": "promptText",
                            "description": "The text to enter into the dialog prompt before accepting. Used only if this is a prompt\ndialog.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "navigate",
                    "description": "Navigates current page to the given URL.",
                    "parameters": [
                        {
                            "name": "url",
                            "description": "URL to navigate the page to.",
                            "type": "string"
                        },
                        {
                            "name": "referrer",
                            "description": "Referrer URL.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "transitionType",
                            "description": "Intended transition type.",
                            "optional": true,
                            "$ref": "TransitionType"
                        },
                        {
                            "name": "frameId",
                            "description": "Frame id to navigate, if not specified navigates the top frame.",
                            "optional": true,
                            "$ref": "FrameId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "frameId",
                            "description": "Frame id that has navigated (or failed to navigate)",
                            "$ref": "FrameId"
                        },
                        {
                            "name": "loaderId",
                            "description": "Loader identifier.",
                            "optional": true,
                            "$ref": "Network.LoaderId"
                        },
                        {
                            "name": "errorText",
                            "description": "User friendly error message, present if and only if navigation has failed.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "navigateToHistoryEntry",
                    "description": "Navigates current page to the given history entry.",
                    "parameters": [
                        {
                            "name": "entryId",
                            "description": "Unique id of the entry to navigate to.",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "name": "printToPDF",
                    "description": "Print page as PDF.",
                    "parameters": [
                        {
                            "name": "landscape",
                            "description": "Paper orientation. Defaults to false.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "displayHeaderFooter",
                            "description": "Display header and footer. Defaults to false.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "printBackground",
                            "description": "Print background graphics. Defaults to false.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "scale",
                            "description": "Scale of the webpage rendering. Defaults to 1.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "paperWidth",
                            "description": "Paper width in inches. Defaults to 8.5 inches.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "paperHeight",
                            "description": "Paper height in inches. Defaults to 11 inches.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "marginTop",
                            "description": "Top margin in inches. Defaults to 1cm (~0.4 inches).",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "marginBottom",
                            "description": "Bottom margin in inches. Defaults to 1cm (~0.4 inches).",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "marginLeft",
                            "description": "Left margin in inches. Defaults to 1cm (~0.4 inches).",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "marginRight",
                            "description": "Right margin in inches. Defaults to 1cm (~0.4 inches).",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "pageRanges",
                            "description": "Paper ranges to print, e.g., '1-5, 8, 11-13'. Defaults to the empty string, which means\nprint all pages.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "ignoreInvalidPageRanges",
                            "description": "Whether to silently ignore invalid but successfully parsed page ranges, such as '3-2'.\nDefaults to false.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "headerTemplate",
                            "description": "HTML template for the print header. Should be valid HTML markup with following\nclasses used to inject printing values into them:\n- `date`: formatted print date\n- `title`: document title\n- `url`: document location\n- `pageNumber`: current page number\n- `totalPages`: total pages in the document\n\nFor example, `<span class=title></span>` would generate span containing the title.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "footerTemplate",
                            "description": "HTML template for the print footer. Should use the same format as the `headerTemplate`.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "preferCSSPageSize",
                            "description": "Whether or not to prefer page size as defined by css. Defaults to false,\nin which case the content will be scaled to fit the paper size.",
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "data",
                            "description": "Base64-encoded pdf data.",
                            "type": "binary"
                        }
                    ]
                },
                {
                    "name": "reload",
                    "description": "Reloads given page optionally ignoring the cache.",
                    "parameters": [
                        {
                            "name": "ignoreCache",
                            "description": "If true, browser cache is ignored (as if the user pressed Shift+refresh).",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "scriptToEvaluateOnLoad",
                            "description": "If set, the script will be injected into all frames of the inspected page after reload.\nArgument will be ignored if reloading dataURL origin.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "removeScriptToEvaluateOnLoad",
                    "description": "Deprecated, please use removeScriptToEvaluateOnNewDocument instead.",
                    "experimental": true,
                    "deprecated": true,
                    "parameters": [
                        {
                            "name": "identifier",
                            "$ref": "ScriptIdentifier"
                        }
                    ]
                },
                {
                    "name": "removeScriptToEvaluateOnNewDocument",
                    "description": "Removes given script from the list.",
                    "parameters": [
                        {
                            "name": "identifier",
                            "$ref": "ScriptIdentifier"
                        }
                    ]
                },
                {
                    "name": "requestAppBanner",
                    "experimental": true
                },
                {
                    "name": "screencastFrameAck",
                    "description": "Acknowledges that a screencast frame has been received by the frontend.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "sessionId",
                            "description": "Frame number.",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "name": "searchInResource",
                    "description": "Searches for given string in resource content.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "frameId",
                            "description": "Frame id for resource to search in.",
                            "$ref": "FrameId"
                        },
                        {
                            "name": "url",
                            "description": "URL of the resource to search in.",
                            "type": "string"
                        },
                        {
                            "name": "query",
                            "description": "String to search for.",
                            "type": "string"
                        },
                        {
                            "name": "caseSensitive",
                            "description": "If true, search is case sensitive.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "isRegex",
                            "description": "If true, treats string parameter as regex.",
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "result",
                            "description": "List of search matches.",
                            "type": "array",
                            "items": {
                                "$ref": "Debugger.SearchMatch"
                            }
                        }
                    ]
                },
                {
                    "name": "setAdBlockingEnabled",
                    "description": "Enable Chrome's experimental ad filter on all sites.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "enabled",
                            "description": "Whether to block ads.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setBypassCSP",
                    "description": "Enable page Content Security Policy by-passing.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "enabled",
                            "description": "Whether to bypass page CSP.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setDeviceMetricsOverride",
                    "description": "Overrides the values of device screen dimensions (window.screen.width, window.screen.height,\nwindow.innerWidth, window.innerHeight, and \"device-width\"/\"device-height\"-related CSS media\nquery results).",
                    "experimental": true,
                    "deprecated": true,
                    "redirect": "Emulation",
                    "parameters": [
                        {
                            "name": "width",
                            "description": "Overriding width value in pixels (minimum 0, maximum 10000000). 0 disables the override.",
                            "type": "integer"
                        },
                        {
                            "name": "height",
                            "description": "Overriding height value in pixels (minimum 0, maximum 10000000). 0 disables the override.",
                            "type": "integer"
                        },
                        {
                            "name": "deviceScaleFactor",
                            "description": "Overriding device scale factor value. 0 disables the override.",
                            "type": "number"
                        },
                        {
                            "name": "mobile",
                            "description": "Whether to emulate mobile device. This includes viewport meta tag, overlay scrollbars, text\nautosizing and more.",
                            "type": "boolean"
                        },
                        {
                            "name": "scale",
                            "description": "Scale to apply to resulting view image.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "screenWidth",
                            "description": "Overriding screen width value in pixels (minimum 0, maximum 10000000).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "screenHeight",
                            "description": "Overriding screen height value in pixels (minimum 0, maximum 10000000).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "positionX",
                            "description": "Overriding view X position on screen in pixels (minimum 0, maximum 10000000).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "positionY",
                            "description": "Overriding view Y position on screen in pixels (minimum 0, maximum 10000000).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "dontSetVisibleSize",
                            "description": "Do not set visible view size, rely upon explicit setVisibleSize call.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "screenOrientation",
                            "description": "Screen orientation override.",
                            "optional": true,
                            "$ref": "Emulation.ScreenOrientation"
                        },
                        {
                            "name": "viewport",
                            "description": "The viewport dimensions and scale. If not set, the override is cleared.",
                            "optional": true,
                            "$ref": "Viewport"
                        }
                    ]
                },
                {
                    "name": "setDeviceOrientationOverride",
                    "description": "Overrides the Device Orientation.",
                    "experimental": true,
                    "deprecated": true,
                    "redirect": "DeviceOrientation",
                    "parameters": [
                        {
                            "name": "alpha",
                            "description": "Mock alpha",
                            "type": "number"
                        },
                        {
                            "name": "beta",
                            "description": "Mock beta",
                            "type": "number"
                        },
                        {
                            "name": "gamma",
                            "description": "Mock gamma",
                            "type": "number"
                        }
                    ]
                },
                {
                    "name": "setFontFamilies",
                    "description": "Set generic font families.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "fontFamilies",
                            "description": "Specifies font families to set. If a font family is not specified, it won't be changed.",
                            "$ref": "FontFamilies"
                        }
                    ]
                },
                {
                    "name": "setFontSizes",
                    "description": "Set default font sizes.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "fontSizes",
                            "description": "Specifies font sizes to set. If a font size is not specified, it won't be changed.",
                            "$ref": "FontSizes"
                        }
                    ]
                },
                {
                    "name": "setDocumentContent",
                    "description": "Sets given markup as the document's HTML.",
                    "parameters": [
                        {
                            "name": "frameId",
                            "description": "Frame id to set HTML for.",
                            "$ref": "FrameId"
                        },
                        {
                            "name": "html",
                            "description": "HTML content to set.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "setDownloadBehavior",
                    "description": "Set the behavior when downloading a file.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "behavior",
                            "description": "Whether to allow all or deny all download requests, or use default Chrome behavior if\navailable (otherwise deny).",
                            "type": "string",
                            "enum": [
                                "deny",
                                "allow",
                                "default"
                            ]
                        },
                        {
                            "name": "downloadPath",
                            "description": "The default path to save downloaded files to. This is requred if behavior is set to 'allow'",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "setGeolocationOverride",
                    "description": "Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position\nunavailable.",
                    "deprecated": true,
                    "redirect": "Emulation",
                    "parameters": [
                        {
                            "name": "latitude",
                            "description": "Mock latitude",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "longitude",
                            "description": "Mock longitude",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "accuracy",
                            "description": "Mock accuracy",
                            "optional": true,
                            "type": "number"
                        }
                    ]
                },
                {
                    "name": "setLifecycleEventsEnabled",
                    "description": "Controls whether page will emit lifecycle events.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "enabled",
                            "description": "If true, starts emitting lifecycle events.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setTouchEmulationEnabled",
                    "description": "Toggles mouse event-based touch event emulation.",
                    "experimental": true,
                    "deprecated": true,
                    "redirect": "Emulation",
                    "parameters": [
                        {
                            "name": "enabled",
                            "description": "Whether the touch event emulation should be enabled.",
                            "type": "boolean"
                        },
                        {
                            "name": "configuration",
                            "description": "Touch/gesture events configuration. Default: current platform.",
                            "optional": true,
                            "type": "string",
                            "enum": [
                                "mobile",
                                "desktop"
                            ]
                        }
                    ]
                },
                {
                    "name": "startScreencast",
                    "description": "Starts sending each frame using the `screencastFrame` event.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "format",
                            "description": "Image compression format.",
                            "optional": true,
                            "type": "string",
                            "enum": [
                                "jpeg",
                                "png"
                            ]
                        },
                        {
                            "name": "quality",
                            "description": "Compression quality from range [0..100].",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "maxWidth",
                            "description": "Maximum screenshot width.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "maxHeight",
                            "description": "Maximum screenshot height.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "everyNthFrame",
                            "description": "Send every n-th frame.",
                            "optional": true,
                            "type": "integer"
                        }
                    ]
                },
                {
                    "name": "stopLoading",
                    "description": "Force the page stop all navigations and pending resource fetches."
                },
                {
                    "name": "crash",
                    "description": "Crashes renderer on the IO thread, generates minidumps.",
                    "experimental": true
                },
                {
                    "name": "close",
                    "description": "Tries to close page, running its beforeunload hooks, if any.",
                    "experimental": true
                },
                {
                    "name": "setWebLifecycleState",
                    "description": "Tries to update the web lifecycle state of the page.\nIt will transition the page to the given state according to:\nhttps://github.com/WICG/web-lifecycle/",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "state",
                            "description": "Target lifecycle state",
                            "type": "string",
                            "enum": [
                                "frozen",
                                "active"
                            ]
                        }
                    ]
                },
                {
                    "name": "stopScreencast",
                    "description": "Stops sending each frame in the `screencastFrame`.",
                    "experimental": true
                },
                {
                    "name": "setProduceCompilationCache",
                    "description": "Forces compilation cache to be generated for every subresource script.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "enabled",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "addCompilationCache",
                    "description": "Seeds compilation cache for given url. Compilation cache does not survive\ncross-process navigation.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "url",
                            "type": "string"
                        },
                        {
                            "name": "data",
                            "description": "Base64-encoded data",
                            "type": "binary"
                        }
                    ]
                },
                {
                    "name": "clearCompilationCache",
                    "description": "Clears seeded compilation cache.",
                    "experimental": true
                },
                {
                    "name": "generateTestReport",
                    "description": "Generates a report for testing.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "message",
                            "description": "Message to be displayed in the report.",
                            "type": "string"
                        },
                        {
                            "name": "group",
                            "description": "Specifies the endpoint group to deliver the report to.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "domContentEventFired",
                    "parameters": [
                        {
                            "name": "timestamp",
                            "$ref": "Network.MonotonicTime"
                        }
                    ]
                },
                {
                    "name": "frameAttached",
                    "description": "Fired when frame has been attached to its parent.",
                    "parameters": [
                        {
                            "name": "frameId",
                            "description": "Id of the frame that has been attached.",
                            "$ref": "FrameId"
                        },
                        {
                            "name": "parentFrameId",
                            "description": "Parent frame identifier.",
                            "$ref": "FrameId"
                        },
                        {
                            "name": "stack",
                            "description": "JavaScript stack trace of when frame was attached, only set if frame initiated from script.",
                            "optional": true,
                            "$ref": "Runtime.StackTrace"
                        }
                    ]
                },
                {
                    "name": "frameClearedScheduledNavigation",
                    "description": "Fired when frame no longer has a scheduled navigation.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "frameId",
                            "description": "Id of the frame that has cleared its scheduled navigation.",
                            "$ref": "FrameId"
                        }
                    ]
                },
                {
                    "name": "frameDetached",
                    "description": "Fired when frame has been detached from its parent.",
                    "parameters": [
                        {
                            "name": "frameId",
                            "description": "Id of the frame that has been detached.",
                            "$ref": "FrameId"
                        }
                    ]
                },
                {
                    "name": "frameNavigated",
                    "description": "Fired once navigation of the frame has completed. Frame is now associated with the new loader.",
                    "parameters": [
                        {
                            "name": "frame",
                            "description": "Frame object.",
                            "$ref": "Frame"
                        }
                    ]
                },
                {
                    "name": "frameResized",
                    "experimental": true
                },
                {
                    "name": "frameScheduledNavigation",
                    "description": "Fired when frame schedules a potential navigation.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "frameId",
                            "description": "Id of the frame that has scheduled a navigation.",
                            "$ref": "FrameId"
                        },
                        {
                            "name": "delay",
                            "description": "Delay (in seconds) until the navigation is scheduled to begin. The navigation is not\nguaranteed to start.",
                            "type": "number"
                        },
                        {
                            "name": "reason",
                            "description": "The reason for the navigation.",
                            "type": "string",
                            "enum": [
                                "formSubmissionGet",
                                "formSubmissionPost",
                                "httpHeaderRefresh",
                                "scriptInitiated",
                                "metaTagRefresh",
                                "pageBlockInterstitial",
                                "reload"
                            ]
                        },
                        {
                            "name": "url",
                            "description": "The destination URL for the scheduled navigation.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "frameStartedLoading",
                    "description": "Fired when frame has started loading.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "frameId",
                            "description": "Id of the frame that has started loading.",
                            "$ref": "FrameId"
                        }
                    ]
                },
                {
                    "name": "frameStoppedLoading",
                    "description": "Fired when frame has stopped loading.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "frameId",
                            "description": "Id of the frame that has stopped loading.",
                            "$ref": "FrameId"
                        }
                    ]
                },
                {
                    "name": "interstitialHidden",
                    "description": "Fired when interstitial page was hidden"
                },
                {
                    "name": "interstitialShown",
                    "description": "Fired when interstitial page was shown"
                },
                {
                    "name": "javascriptDialogClosed",
                    "description": "Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) has been\nclosed.",
                    "parameters": [
                        {
                            "name": "result",
                            "description": "Whether dialog was confirmed.",
                            "type": "boolean"
                        },
                        {
                            "name": "userInput",
                            "description": "User input in case of prompt.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "javascriptDialogOpening",
                    "description": "Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) is about to\nopen.",
                    "parameters": [
                        {
                            "name": "url",
                            "description": "Frame url.",
                            "type": "string"
                        },
                        {
                            "name": "message",
                            "description": "Message that will be displayed by the dialog.",
                            "type": "string"
                        },
                        {
                            "name": "type",
                            "description": "Dialog type.",
                            "$ref": "DialogType"
                        },
                        {
                            "name": "hasBrowserHandler",
                            "description": "True iff browser is capable showing or acting on the given dialog. When browser has no\ndialog handler for given target, calling alert while Page domain is engaged will stall\nthe page execution. Execution can be resumed via calling Page.handleJavaScriptDialog.",
                            "type": "boolean"
                        },
                        {
                            "name": "defaultPrompt",
                            "description": "Default dialog prompt.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "lifecycleEvent",
                    "description": "Fired for top level page lifecycle events such as navigation, load, paint, etc.",
                    "parameters": [
                        {
                            "name": "frameId",
                            "description": "Id of the frame.",
                            "$ref": "FrameId"
                        },
                        {
                            "name": "loaderId",
                            "description": "Loader identifier. Empty string if the request is fetched from worker.",
                            "$ref": "Network.LoaderId"
                        },
                        {
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "name": "timestamp",
                            "$ref": "Network.MonotonicTime"
                        }
                    ]
                },
                {
                    "name": "loadEventFired",
                    "parameters": [
                        {
                            "name": "timestamp",
                            "$ref": "Network.MonotonicTime"
                        }
                    ]
                },
                {
                    "name": "navigatedWithinDocument",
                    "description": "Fired when same-document navigation happens, e.g. due to history API usage or anchor navigation.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "frameId",
                            "description": "Id of the frame.",
                            "$ref": "FrameId"
                        },
                        {
                            "name": "url",
                            "description": "Frame's new url.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "screencastFrame",
                    "description": "Compressed image data requested by the `startScreencast`.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "data",
                            "description": "Base64-encoded compressed image.",
                            "type": "binary"
                        },
                        {
                            "name": "metadata",
                            "description": "Screencast frame metadata.",
                            "$ref": "ScreencastFrameMetadata"
                        },
                        {
                            "name": "sessionId",
                            "description": "Frame number.",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "name": "screencastVisibilityChanged",
                    "description": "Fired when the page with currently enabled screencast was shown or hidden `.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "visible",
                            "description": "True if the page is visible.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "windowOpen",
                    "description": "Fired when a new window is going to be opened, via window.open(), link click, form submission,\netc.",
                    "parameters": [
                        {
                            "name": "url",
                            "description": "The URL for the new window.",
                            "type": "string"
                        },
                        {
                            "name": "windowName",
                            "description": "Window name.",
                            "type": "string"
                        },
                        {
                            "name": "windowFeatures",
                            "description": "An array of enabled window features.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "userGesture",
                            "description": "Whether or not it was triggered by user gesture.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "compilationCacheProduced",
                    "description": "Issued for every compilation cache generated. Is only available\nif Page.setGenerateCompilationCache is enabled.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "url",
                            "type": "string"
                        },
                        {
                            "name": "data",
                            "description": "Base64-encoded data",
                            "type": "binary"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Performance",
            "types": [
                {
                    "id": "Metric",
                    "description": "Run-time execution metric.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "name",
                            "description": "Metric name.",
                            "type": "string"
                        },
                        {
                            "name": "value",
                            "description": "Metric value.",
                            "type": "number"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "disable",
                    "description": "Disable collecting and reporting metrics."
                },
                {
                    "name": "enable",
                    "description": "Enable collecting and reporting metrics."
                },
                {
                    "name": "setTimeDomain",
                    "description": "Sets time domain to use for collecting and reporting duration metrics.\nNote that this must be called before enabling metrics collection. Calling\nthis method while metrics collection is enabled returns an error.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "timeDomain",
                            "description": "Time domain",
                            "type": "string",
                            "enum": [
                                "timeTicks",
                                "threadTicks"
                            ]
                        }
                    ]
                },
                {
                    "name": "getMetrics",
                    "description": "Retrieve current values of run-time metrics.",
                    "returns": [
                        {
                            "name": "metrics",
                            "description": "Current values for run-time metrics.",
                            "type": "array",
                            "items": {
                                "$ref": "Metric"
                            }
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "metrics",
                    "description": "Current values of the metrics.",
                    "parameters": [
                        {
                            "name": "metrics",
                            "description": "Current values of the metrics.",
                            "type": "array",
                            "items": {
                                "$ref": "Metric"
                            }
                        },
                        {
                            "name": "title",
                            "description": "Timestamp title.",
                            "type": "string"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Security",
            "description": "Security",
            "types": [
                {
                    "id": "CertificateId",
                    "description": "An internal certificate ID value.",
                    "type": "integer"
                },
                {
                    "id": "MixedContentType",
                    "description": "A description of mixed content (HTTP resources on HTTPS pages), as defined by\nhttps://www.w3.org/TR/mixed-content/#categories",
                    "type": "string",
                    "enum": [
                        "blockable",
                        "optionally-blockable",
                        "none"
                    ]
                },
                {
                    "id": "SecurityState",
                    "description": "The security level of a page or resource.",
                    "type": "string",
                    "enum": [
                        "unknown",
                        "neutral",
                        "insecure",
                        "secure",
                        "info"
                    ]
                },
                {
                    "id": "SecurityStateExplanation",
                    "description": "An explanation of an factor contributing to the security state.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "securityState",
                            "description": "Security state representing the severity of the factor being explained.",
                            "$ref": "SecurityState"
                        },
                        {
                            "name": "title",
                            "description": "Title describing the type of factor.",
                            "type": "string"
                        },
                        {
                            "name": "summary",
                            "description": "Short phrase describing the type of factor.",
                            "type": "string"
                        },
                        {
                            "name": "description",
                            "description": "Full text explanation of the factor.",
                            "type": "string"
                        },
                        {
                            "name": "mixedContentType",
                            "description": "The type of mixed content described by the explanation.",
                            "$ref": "MixedContentType"
                        },
                        {
                            "name": "certificate",
                            "description": "Page certificate.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "recommendations",
                            "description": "Recommendations to fix any issues.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                },
                {
                    "id": "InsecureContentStatus",
                    "description": "Information about insecure content on the page.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "ranMixedContent",
                            "description": "True if the page was loaded over HTTPS and ran mixed (HTTP) content such as scripts.",
                            "type": "boolean"
                        },
                        {
                            "name": "displayedMixedContent",
                            "description": "True if the page was loaded over HTTPS and displayed mixed (HTTP) content such as images.",
                            "type": "boolean"
                        },
                        {
                            "name": "containedMixedForm",
                            "description": "True if the page was loaded over HTTPS and contained a form targeting an insecure url.",
                            "type": "boolean"
                        },
                        {
                            "name": "ranContentWithCertErrors",
                            "description": "True if the page was loaded over HTTPS without certificate errors, and ran content such as\nscripts that were loaded with certificate errors.",
                            "type": "boolean"
                        },
                        {
                            "name": "displayedContentWithCertErrors",
                            "description": "True if the page was loaded over HTTPS without certificate errors, and displayed content\nsuch as images that were loaded with certificate errors.",
                            "type": "boolean"
                        },
                        {
                            "name": "ranInsecureContentStyle",
                            "description": "Security state representing a page that ran insecure content.",
                            "$ref": "SecurityState"
                        },
                        {
                            "name": "displayedInsecureContentStyle",
                            "description": "Security state representing a page that displayed insecure content.",
                            "$ref": "SecurityState"
                        }
                    ]
                },
                {
                    "id": "CertificateErrorAction",
                    "description": "The action to take when a certificate error occurs. continue will continue processing the\nrequest and cancel will cancel the request.",
                    "type": "string",
                    "enum": [
                        "continue",
                        "cancel"
                    ]
                }
            ],
            "commands": [
                {
                    "name": "disable",
                    "description": "Disables tracking security state changes."
                },
                {
                    "name": "enable",
                    "description": "Enables tracking security state changes."
                },
                {
                    "name": "setIgnoreCertificateErrors",
                    "description": "Enable/disable whether all certificate errors should be ignored.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "ignore",
                            "description": "If true, all certificate errors will be ignored.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "handleCertificateError",
                    "description": "Handles a certificate error that fired a certificateError event.",
                    "deprecated": true,
                    "parameters": [
                        {
                            "name": "eventId",
                            "description": "The ID of the event.",
                            "type": "integer"
                        },
                        {
                            "name": "action",
                            "description": "The action to take on the certificate error.",
                            "$ref": "CertificateErrorAction"
                        }
                    ]
                },
                {
                    "name": "setOverrideCertificateErrors",
                    "description": "Enable/disable overriding certificate errors. If enabled, all certificate error events need to\nbe handled by the DevTools client and should be answered with `handleCertificateError` commands.",
                    "deprecated": true,
                    "parameters": [
                        {
                            "name": "override",
                            "description": "If true, certificate errors will be overridden.",
                            "type": "boolean"
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "certificateError",
                    "description": "There is a certificate error. If overriding certificate errors is enabled, then it should be\nhandled with the `handleCertificateError` command. Note: this event does not fire if the\ncertificate error has been allowed internally. Only one client per target should override\ncertificate errors at the same time.",
                    "deprecated": true,
                    "parameters": [
                        {
                            "name": "eventId",
                            "description": "The ID of the event.",
                            "type": "integer"
                        },
                        {
                            "name": "errorType",
                            "description": "The type of the error.",
                            "type": "string"
                        },
                        {
                            "name": "requestURL",
                            "description": "The url that was requested.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "securityStateChanged",
                    "description": "The security state of the page changed.",
                    "parameters": [
                        {
                            "name": "securityState",
                            "description": "Security state.",
                            "$ref": "SecurityState"
                        },
                        {
                            "name": "schemeIsCryptographic",
                            "description": "True if the page was loaded over cryptographic transport such as HTTPS.",
                            "type": "boolean"
                        },
                        {
                            "name": "explanations",
                            "description": "List of explanations for the security state. If the overall security state is `insecure` or\n`warning`, at least one corresponding explanation should be included.",
                            "type": "array",
                            "items": {
                                "$ref": "SecurityStateExplanation"
                            }
                        },
                        {
                            "name": "insecureContentStatus",
                            "description": "Information about insecure content on the page.",
                            "$ref": "InsecureContentStatus"
                        },
                        {
                            "name": "summary",
                            "description": "Overrides user-visible description of the state.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "ServiceWorker",
            "experimental": true,
            "types": [
                {
                    "id": "ServiceWorkerRegistration",
                    "description": "ServiceWorker registration.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "registrationId",
                            "type": "string"
                        },
                        {
                            "name": "scopeURL",
                            "type": "string"
                        },
                        {
                            "name": "isDeleted",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "id": "ServiceWorkerVersionRunningStatus",
                    "type": "string",
                    "enum": [
                        "stopped",
                        "starting",
                        "running",
                        "stopping"
                    ]
                },
                {
                    "id": "ServiceWorkerVersionStatus",
                    "type": "string",
                    "enum": [
                        "new",
                        "installing",
                        "installed",
                        "activating",
                        "activated",
                        "redundant"
                    ]
                },
                {
                    "id": "ServiceWorkerVersion",
                    "description": "ServiceWorker version.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "versionId",
                            "type": "string"
                        },
                        {
                            "name": "registrationId",
                            "type": "string"
                        },
                        {
                            "name": "scriptURL",
                            "type": "string"
                        },
                        {
                            "name": "runningStatus",
                            "$ref": "ServiceWorkerVersionRunningStatus"
                        },
                        {
                            "name": "status",
                            "$ref": "ServiceWorkerVersionStatus"
                        },
                        {
                            "name": "scriptLastModified",
                            "description": "The Last-Modified header value of the main script.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "scriptResponseTime",
                            "description": "The time at which the response headers of the main script were received from the server.\nFor cached script it is the last time the cache entry was validated.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "controlledClients",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "Target.TargetID"
                            }
                        },
                        {
                            "name": "targetId",
                            "optional": true,
                            "$ref": "Target.TargetID"
                        }
                    ]
                },
                {
                    "id": "ServiceWorkerErrorMessage",
                    "description": "ServiceWorker error message.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "errorMessage",
                            "type": "string"
                        },
                        {
                            "name": "registrationId",
                            "type": "string"
                        },
                        {
                            "name": "versionId",
                            "type": "string"
                        },
                        {
                            "name": "sourceURL",
                            "type": "string"
                        },
                        {
                            "name": "lineNumber",
                            "type": "integer"
                        },
                        {
                            "name": "columnNumber",
                            "type": "integer"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "deliverPushMessage",
                    "parameters": [
                        {
                            "name": "origin",
                            "type": "string"
                        },
                        {
                            "name": "registrationId",
                            "type": "string"
                        },
                        {
                            "name": "data",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "disable"
                },
                {
                    "name": "dispatchSyncEvent",
                    "parameters": [
                        {
                            "name": "origin",
                            "type": "string"
                        },
                        {
                            "name": "registrationId",
                            "type": "string"
                        },
                        {
                            "name": "tag",
                            "type": "string"
                        },
                        {
                            "name": "lastChance",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "enable"
                },
                {
                    "name": "inspectWorker",
                    "parameters": [
                        {
                            "name": "versionId",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "setForceUpdateOnPageLoad",
                    "parameters": [
                        {
                            "name": "forceUpdateOnPageLoad",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "skipWaiting",
                    "parameters": [
                        {
                            "name": "scopeURL",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "startWorker",
                    "parameters": [
                        {
                            "name": "scopeURL",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "stopAllWorkers"
                },
                {
                    "name": "stopWorker",
                    "parameters": [
                        {
                            "name": "versionId",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "unregister",
                    "parameters": [
                        {
                            "name": "scopeURL",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "updateRegistration",
                    "parameters": [
                        {
                            "name": "scopeURL",
                            "type": "string"
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "workerErrorReported",
                    "parameters": [
                        {
                            "name": "errorMessage",
                            "$ref": "ServiceWorkerErrorMessage"
                        }
                    ]
                },
                {
                    "name": "workerRegistrationUpdated",
                    "parameters": [
                        {
                            "name": "registrations",
                            "type": "array",
                            "items": {
                                "$ref": "ServiceWorkerRegistration"
                            }
                        }
                    ]
                },
                {
                    "name": "workerVersionUpdated",
                    "parameters": [
                        {
                            "name": "versions",
                            "type": "array",
                            "items": {
                                "$ref": "ServiceWorkerVersion"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Storage",
            "experimental": true,
            "types": [
                {
                    "id": "StorageType",
                    "description": "Enum of possible storage types.",
                    "type": "string",
                    "enum": [
                        "appcache",
                        "cookies",
                        "file_systems",
                        "indexeddb",
                        "local_storage",
                        "shader_cache",
                        "websql",
                        "service_workers",
                        "cache_storage",
                        "all",
                        "other"
                    ]
                },
                {
                    "id": "UsageForType",
                    "description": "Usage for a storage type.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "storageType",
                            "description": "Name of storage type.",
                            "$ref": "StorageType"
                        },
                        {
                            "name": "usage",
                            "description": "Storage usage (bytes).",
                            "type": "number"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "clearDataForOrigin",
                    "description": "Clears storage for origin.",
                    "parameters": [
                        {
                            "name": "origin",
                            "description": "Security origin.",
                            "type": "string"
                        },
                        {
                            "name": "storageTypes",
                            "description": "Comma separated origin names.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "getUsageAndQuota",
                    "description": "Returns usage and quota in bytes.",
                    "parameters": [
                        {
                            "name": "origin",
                            "description": "Security origin.",
                            "type": "string"
                        }
                    ],
                    "returns": [
                        {
                            "name": "usage",
                            "description": "Storage usage (bytes).",
                            "type": "number"
                        },
                        {
                            "name": "quota",
                            "description": "Storage quota (bytes).",
                            "type": "number"
                        },
                        {
                            "name": "usageBreakdown",
                            "description": "Storage usage per type (bytes).",
                            "type": "array",
                            "items": {
                                "$ref": "UsageForType"
                            }
                        }
                    ]
                },
                {
                    "name": "trackCacheStorageForOrigin",
                    "description": "Registers origin to be notified when an update occurs to its cache storage list.",
                    "parameters": [
                        {
                            "name": "origin",
                            "description": "Security origin.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "trackIndexedDBForOrigin",
                    "description": "Registers origin to be notified when an update occurs to its IndexedDB.",
                    "parameters": [
                        {
                            "name": "origin",
                            "description": "Security origin.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "untrackCacheStorageForOrigin",
                    "description": "Unregisters origin from receiving notifications for cache storage.",
                    "parameters": [
                        {
                            "name": "origin",
                            "description": "Security origin.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "untrackIndexedDBForOrigin",
                    "description": "Unregisters origin from receiving notifications for IndexedDB.",
                    "parameters": [
                        {
                            "name": "origin",
                            "description": "Security origin.",
                            "type": "string"
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "cacheStorageContentUpdated",
                    "description": "A cache's contents have been modified.",
                    "parameters": [
                        {
                            "name": "origin",
                            "description": "Origin to update.",
                            "type": "string"
                        },
                        {
                            "name": "cacheName",
                            "description": "Name of cache in origin.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "cacheStorageListUpdated",
                    "description": "A cache has been added/deleted.",
                    "parameters": [
                        {
                            "name": "origin",
                            "description": "Origin to update.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "indexedDBContentUpdated",
                    "description": "The origin's IndexedDB object store has been modified.",
                    "parameters": [
                        {
                            "name": "origin",
                            "description": "Origin to update.",
                            "type": "string"
                        },
                        {
                            "name": "databaseName",
                            "description": "Database to update.",
                            "type": "string"
                        },
                        {
                            "name": "objectStoreName",
                            "description": "ObjectStore to update.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "indexedDBListUpdated",
                    "description": "The origin's IndexedDB database list has been modified.",
                    "parameters": [
                        {
                            "name": "origin",
                            "description": "Origin to update.",
                            "type": "string"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "SystemInfo",
            "description": "The SystemInfo domain defines methods and events for querying low-level system information.",
            "experimental": true,
            "types": [
                {
                    "id": "GPUDevice",
                    "description": "Describes a single graphics processor (GPU).",
                    "type": "object",
                    "properties": [
                        {
                            "name": "vendorId",
                            "description": "PCI ID of the GPU vendor, if available; 0 otherwise.",
                            "type": "number"
                        },
                        {
                            "name": "deviceId",
                            "description": "PCI ID of the GPU device, if available; 0 otherwise.",
                            "type": "number"
                        },
                        {
                            "name": "vendorString",
                            "description": "String description of the GPU vendor, if the PCI ID is not available.",
                            "type": "string"
                        },
                        {
                            "name": "deviceString",
                            "description": "String description of the GPU device, if the PCI ID is not available.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "GPUInfo",
                    "description": "Provides information about the GPU(s) on the system.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "devices",
                            "description": "The graphics devices on the system. Element 0 is the primary GPU.",
                            "type": "array",
                            "items": {
                                "$ref": "GPUDevice"
                            }
                        },
                        {
                            "name": "auxAttributes",
                            "description": "An optional dictionary of additional GPU related attributes.",
                            "optional": true,
                            "type": "object"
                        },
                        {
                            "name": "featureStatus",
                            "description": "An optional dictionary of graphics features and their status.",
                            "optional": true,
                            "type": "object"
                        },
                        {
                            "name": "driverBugWorkarounds",
                            "description": "An optional array of GPU driver bug workarounds.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                },
                {
                    "id": "ProcessInfo",
                    "description": "Represents process info.",
                    "type": "object",
                    "properties": [
                        {
                            "name": "type",
                            "description": "Specifies process type.",
                            "type": "string"
                        },
                        {
                            "name": "id",
                            "description": "Specifies process id.",
                            "type": "integer"
                        },
                        {
                            "name": "cpuTime",
                            "description": "Specifies cumulative CPU usage in seconds across all threads of the\nprocess since the process start.",
                            "type": "number"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "getInfo",
                    "description": "Returns information about the system.",
                    "returns": [
                        {
                            "name": "gpu",
                            "description": "Information about the GPUs on the system.",
                            "$ref": "GPUInfo"
                        },
                        {
                            "name": "modelName",
                            "description": "A platform-dependent description of the model of the machine. On Mac OS, this is, for\nexample, 'MacBookPro'. Will be the empty string if not supported.",
                            "type": "string"
                        },
                        {
                            "name": "modelVersion",
                            "description": "A platform-dependent description of the version of the machine. On Mac OS, this is, for\nexample, '10.1'. Will be the empty string if not supported.",
                            "type": "string"
                        },
                        {
                            "name": "commandLine",
                            "description": "The command line string used to launch the browser. Will be the empty string if not\nsupported.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "getProcessInfo",
                    "description": "Returns information about all running processes.",
                    "returns": [
                        {
                            "name": "processInfo",
                            "description": "An array of process info blocks.",
                            "type": "array",
                            "items": {
                                "$ref": "ProcessInfo"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Target",
            "description": "Supports additional targets discovery and allows to attach to them.",
            "types": [
                {
                    "id": "TargetID",
                    "type": "string"
                },
                {
                    "id": "SessionID",
                    "description": "Unique identifier of attached debugging session.",
                    "type": "string"
                },
                {
                    "id": "BrowserContextID",
                    "experimental": true,
                    "type": "string"
                },
                {
                    "id": "TargetInfo",
                    "type": "object",
                    "properties": [
                        {
                            "name": "targetId",
                            "$ref": "TargetID"
                        },
                        {
                            "name": "type",
                            "type": "string"
                        },
                        {
                            "name": "title",
                            "type": "string"
                        },
                        {
                            "name": "url",
                            "type": "string"
                        },
                        {
                            "name": "attached",
                            "description": "Whether the target has an attached client.",
                            "type": "boolean"
                        },
                        {
                            "name": "openerId",
                            "description": "Opener target Id",
                            "optional": true,
                            "$ref": "TargetID"
                        },
                        {
                            "name": "browserContextId",
                            "experimental": true,
                            "optional": true,
                            "$ref": "BrowserContextID"
                        }
                    ]
                },
                {
                    "id": "RemoteLocation",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "host",
                            "type": "string"
                        },
                        {
                            "name": "port",
                            "type": "integer"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "activateTarget",
                    "description": "Activates (focuses) the target.",
                    "parameters": [
                        {
                            "name": "targetId",
                            "$ref": "TargetID"
                        }
                    ]
                },
                {
                    "name": "attachToTarget",
                    "description": "Attaches to the target with given id.",
                    "parameters": [
                        {
                            "name": "targetId",
                            "$ref": "TargetID"
                        },
                        {
                            "name": "flatten",
                            "description": "Enables \"flat\" access to the session via specifying sessionId attribute in the commands.",
                            "experimental": true,
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "sessionId",
                            "description": "Id assigned to the session.",
                            "$ref": "SessionID"
                        }
                    ]
                },
                {
                    "name": "attachToBrowserTarget",
                    "description": "Attaches to the browser target, only uses flat sessionId mode.",
                    "experimental": true,
                    "returns": [
                        {
                            "name": "sessionId",
                            "description": "Id assigned to the session.",
                            "$ref": "SessionID"
                        }
                    ]
                },
                {
                    "name": "closeTarget",
                    "description": "Closes the target. If the target is a page that gets closed too.",
                    "parameters": [
                        {
                            "name": "targetId",
                            "$ref": "TargetID"
                        }
                    ],
                    "returns": [
                        {
                            "name": "success",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "exposeDevToolsProtocol",
                    "description": "Inject object to the target's main frame that provides a communication\nchannel with browser target.\n\nInjected object will be available as `window[bindingName]`.\n\nThe object has the follwing API:\n- `binding.send(json)` - a method to send messages over the remote debugging protocol\n- `binding.onmessage = json => handleMessage(json)` - a callback that will be called for the protocol notifications and command responses.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "targetId",
                            "$ref": "TargetID"
                        },
                        {
                            "name": "bindingName",
                            "description": "Binding name, 'cdp' if not specified.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "createBrowserContext",
                    "description": "Creates a new empty BrowserContext. Similar to an incognito profile but you can have more than\none.",
                    "experimental": true,
                    "returns": [
                        {
                            "name": "browserContextId",
                            "description": "The id of the context created.",
                            "$ref": "BrowserContextID"
                        }
                    ]
                },
                {
                    "name": "getBrowserContexts",
                    "description": "Returns all browser contexts created with `Target.createBrowserContext` method.",
                    "experimental": true,
                    "returns": [
                        {
                            "name": "browserContextIds",
                            "description": "An array of browser context ids.",
                            "type": "array",
                            "items": {
                                "$ref": "BrowserContextID"
                            }
                        }
                    ]
                },
                {
                    "name": "createTarget",
                    "description": "Creates a new page.",
                    "parameters": [
                        {
                            "name": "url",
                            "description": "The initial URL the page will be navigated to.",
                            "type": "string"
                        },
                        {
                            "name": "width",
                            "description": "Frame width in DIP (headless chrome only).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "height",
                            "description": "Frame height in DIP (headless chrome only).",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "browserContextId",
                            "description": "The browser context to create the page in.",
                            "optional": true,
                            "$ref": "BrowserContextID"
                        },
                        {
                            "name": "enableBeginFrameControl",
                            "description": "Whether BeginFrames for this target will be controlled via DevTools (headless chrome only,\nnot supported on MacOS yet, false by default).",
                            "experimental": true,
                            "optional": true,
                            "type": "boolean"
                        }
                    ],
                    "returns": [
                        {
                            "name": "targetId",
                            "description": "The id of the page opened.",
                            "$ref": "TargetID"
                        }
                    ]
                },
                {
                    "name": "detachFromTarget",
                    "description": "Detaches session with given id.",
                    "parameters": [
                        {
                            "name": "sessionId",
                            "description": "Session to detach.",
                            "optional": true,
                            "$ref": "SessionID"
                        },
                        {
                            "name": "targetId",
                            "description": "Deprecated.",
                            "deprecated": true,
                            "optional": true,
                            "$ref": "TargetID"
                        }
                    ]
                },
                {
                    "name": "disposeBrowserContext",
                    "description": "Deletes a BrowserContext. All the belonging pages will be closed without calling their\nbeforeunload hooks.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "browserContextId",
                            "$ref": "BrowserContextID"
                        }
                    ]
                },
                {
                    "name": "getTargetInfo",
                    "description": "Returns information about a target.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "targetId",
                            "optional": true,
                            "$ref": "TargetID"
                        }
                    ],
                    "returns": [
                        {
                            "name": "targetInfo",
                            "$ref": "TargetInfo"
                        }
                    ]
                },
                {
                    "name": "getTargets",
                    "description": "Retrieves a list of available targets.",
                    "returns": [
                        {
                            "name": "targetInfos",
                            "description": "The list of targets.",
                            "type": "array",
                            "items": {
                                "$ref": "TargetInfo"
                            }
                        }
                    ]
                },
                {
                    "name": "sendMessageToTarget",
                    "description": "Sends protocol message over session with given id.",
                    "parameters": [
                        {
                            "name": "message",
                            "type": "string"
                        },
                        {
                            "name": "sessionId",
                            "description": "Identifier of the session.",
                            "optional": true,
                            "$ref": "SessionID"
                        },
                        {
                            "name": "targetId",
                            "description": "Deprecated.",
                            "deprecated": true,
                            "optional": true,
                            "$ref": "TargetID"
                        }
                    ]
                },
                {
                    "name": "setAutoAttach",
                    "description": "Controls whether to automatically attach to new targets which are considered to be related to\nthis one. When turned on, attaches to all existing related targets as well. When turned off,\nautomatically detaches from all currently attached targets.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "autoAttach",
                            "description": "Whether to auto-attach to related targets.",
                            "type": "boolean"
                        },
                        {
                            "name": "waitForDebuggerOnStart",
                            "description": "Whether to pause new targets when attaching to them. Use `Runtime.runIfWaitingForDebugger`\nto run paused targets.",
                            "type": "boolean"
                        },
                        {
                            "name": "flatten",
                            "description": "Enables \"flat\" access to the session via specifying sessionId attribute in the commands.",
                            "experimental": true,
                            "optional": true,
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setDiscoverTargets",
                    "description": "Controls whether to discover available targets and notify via\n`targetCreated/targetInfoChanged/targetDestroyed` events.",
                    "parameters": [
                        {
                            "name": "discover",
                            "description": "Whether to discover available targets.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "setRemoteLocations",
                    "description": "Enables target discovery for the specified locations, when `setDiscoverTargets` was set to\n`true`.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "locations",
                            "description": "List of remote locations.",
                            "type": "array",
                            "items": {
                                "$ref": "RemoteLocation"
                            }
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "attachedToTarget",
                    "description": "Issued when attached to target because of auto-attach or `attachToTarget` command.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "sessionId",
                            "description": "Identifier assigned to the session used to send/receive messages.",
                            "$ref": "SessionID"
                        },
                        {
                            "name": "targetInfo",
                            "$ref": "TargetInfo"
                        },
                        {
                            "name": "waitingForDebugger",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "detachedFromTarget",
                    "description": "Issued when detached from target for any reason (including `detachFromTarget` command). Can be\nissued multiple times per target if multiple sessions have been attached to it.",
                    "experimental": true,
                    "parameters": [
                        {
                            "name": "sessionId",
                            "description": "Detached session identifier.",
                            "$ref": "SessionID"
                        },
                        {
                            "name": "targetId",
                            "description": "Deprecated.",
                            "deprecated": true,
                            "optional": true,
                            "$ref": "TargetID"
                        }
                    ]
                },
                {
                    "name": "receivedMessageFromTarget",
                    "description": "Notifies about a new protocol message received from the session (as reported in\n`attachedToTarget` event).",
                    "parameters": [
                        {
                            "name": "sessionId",
                            "description": "Identifier of a session which sends a message.",
                            "$ref": "SessionID"
                        },
                        {
                            "name": "message",
                            "type": "string"
                        },
                        {
                            "name": "targetId",
                            "description": "Deprecated.",
                            "deprecated": true,
                            "optional": true,
                            "$ref": "TargetID"
                        }
                    ]
                },
                {
                    "name": "targetCreated",
                    "description": "Issued when a possible inspection target is created.",
                    "parameters": [
                        {
                            "name": "targetInfo",
                            "$ref": "TargetInfo"
                        }
                    ]
                },
                {
                    "name": "targetDestroyed",
                    "description": "Issued when a target is destroyed.",
                    "parameters": [
                        {
                            "name": "targetId",
                            "$ref": "TargetID"
                        }
                    ]
                },
                {
                    "name": "targetCrashed",
                    "description": "Issued when a target has crashed.",
                    "parameters": [
                        {
                            "name": "targetId",
                            "$ref": "TargetID"
                        },
                        {
                            "name": "status",
                            "description": "Termination status type.",
                            "type": "string"
                        },
                        {
                            "name": "errorCode",
                            "description": "Termination error code.",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "name": "targetInfoChanged",
                    "description": "Issued when some information about a target has changed. This only happens between\n`targetCreated` and `targetDestroyed`.",
                    "parameters": [
                        {
                            "name": "targetInfo",
                            "$ref": "TargetInfo"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Tethering",
            "description": "The Tethering domain defines methods and events for browser port binding.",
            "experimental": true,
            "commands": [
                {
                    "name": "bind",
                    "description": "Request browser port binding.",
                    "parameters": [
                        {
                            "name": "port",
                            "description": "Port number to bind.",
                            "type": "integer"
                        }
                    ]
                },
                {
                    "name": "unbind",
                    "description": "Request browser port unbinding.",
                    "parameters": [
                        {
                            "name": "port",
                            "description": "Port number to unbind.",
                            "type": "integer"
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "accepted",
                    "description": "Informs that port was successfully bound and got a specified connection id.",
                    "parameters": [
                        {
                            "name": "port",
                            "description": "Port number that was successfully bound.",
                            "type": "integer"
                        },
                        {
                            "name": "connectionId",
                            "description": "Connection id to be used.",
                            "type": "string"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Tracing",
            "experimental": true,
            "dependencies": [
                "IO"
            ],
            "types": [
                {
                    "id": "MemoryDumpConfig",
                    "description": "Configuration for memory dump. Used only when \"memory-infra\" category is enabled.",
                    "type": "object"
                },
                {
                    "id": "TraceConfig",
                    "type": "object",
                    "properties": [
                        {
                            "name": "recordMode",
                            "description": "Controls how the trace buffer stores data.",
                            "optional": true,
                            "type": "string",
                            "enum": [
                                "recordUntilFull",
                                "recordContinuously",
                                "recordAsMuchAsPossible",
                                "echoToConsole"
                            ]
                        },
                        {
                            "name": "enableSampling",
                            "description": "Turns on JavaScript stack sampling.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "enableSystrace",
                            "description": "Turns on system tracing.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "enableArgumentFilter",
                            "description": "Turns on argument filter.",
                            "optional": true,
                            "type": "boolean"
                        },
                        {
                            "name": "includedCategories",
                            "description": "Included category filters.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "excludedCategories",
                            "description": "Excluded category filters.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "syntheticDelays",
                            "description": "Configuration to synthesize the delays in tracing.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "memoryDumpConfig",
                            "description": "Configuration for memory dump triggers. Used only when \"memory-infra\" category is enabled.",
                            "optional": true,
                            "$ref": "MemoryDumpConfig"
                        }
                    ]
                },
                {
                    "id": "StreamCompression",
                    "description": "Compression type to use for traces returned via streams.",
                    "type": "string",
                    "enum": [
                        "none",
                        "gzip"
                    ]
                }
            ],
            "commands": [
                {
                    "name": "end",
                    "description": "Stop trace events collection."
                },
                {
                    "name": "getCategories",
                    "description": "Gets supported tracing categories.",
                    "returns": [
                        {
                            "name": "categories",
                            "description": "A list of supported tracing categories.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                },
                {
                    "name": "recordClockSyncMarker",
                    "description": "Record a clock sync marker in the trace.",
                    "parameters": [
                        {
                            "name": "syncId",
                            "description": "The ID of this clock sync marker",
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "requestMemoryDump",
                    "description": "Request a global memory dump.",
                    "returns": [
                        {
                            "name": "dumpGuid",
                            "description": "GUID of the resulting global memory dump.",
                            "type": "string"
                        },
                        {
                            "name": "success",
                            "description": "True iff the global memory dump succeeded.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "start",
                    "description": "Start trace events collection.",
                    "parameters": [
                        {
                            "name": "categories",
                            "description": "Category/tag filter",
                            "deprecated": true,
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "options",
                            "description": "Tracing options",
                            "deprecated": true,
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "bufferUsageReportingInterval",
                            "description": "If set, the agent will issue bufferUsage events at this interval, specified in milliseconds",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "transferMode",
                            "description": "Whether to report trace events as series of dataCollected events or to save trace to a\nstream (defaults to `ReportEvents`).",
                            "optional": true,
                            "type": "string",
                            "enum": [
                                "ReportEvents",
                                "ReturnAsStream"
                            ]
                        },
                        {
                            "name": "streamCompression",
                            "description": "Compression format to use. This only applies when using `ReturnAsStream`\ntransfer mode (defaults to `none`)",
                            "optional": true,
                            "$ref": "StreamCompression"
                        },
                        {
                            "name": "traceConfig",
                            "optional": true,
                            "$ref": "TraceConfig"
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "bufferUsage",
                    "parameters": [
                        {
                            "name": "percentFull",
                            "description": "A number in range [0..1] that indicates the used size of event buffer as a fraction of its\ntotal size.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "eventCount",
                            "description": "An approximate number of events in the trace log.",
                            "optional": true,
                            "type": "number"
                        },
                        {
                            "name": "value",
                            "description": "A number in range [0..1] that indicates the used size of event buffer as a fraction of its\ntotal size.",
                            "optional": true,
                            "type": "number"
                        }
                    ]
                },
                {
                    "name": "dataCollected",
                    "description": "Contains an bucket of collected trace events. When tracing is stopped collected events will be\nsend as a sequence of dataCollected events followed by tracingComplete event.",
                    "parameters": [
                        {
                            "name": "value",
                            "type": "array",
                            "items": {
                                "type": "object"
                            }
                        }
                    ]
                },
                {
                    "name": "tracingComplete",
                    "description": "Signals that tracing is stopped and there is no trace buffers pending flush, all data were\ndelivered via dataCollected events.",
                    "parameters": [
                        {
                            "name": "stream",
                            "description": "A handle of the stream that holds resulting trace data.",
                            "optional": true,
                            "$ref": "IO.StreamHandle"
                        },
                        {
                            "name": "streamCompression",
                            "description": "Compression format of returned stream.",
                            "optional": true,
                            "$ref": "StreamCompression"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Testing",
            "description": "Testing domain is a dumping ground for the capabilities requires for browser or app testing that do not fit other\ndomains.",
            "experimental": true,
            "dependencies": [
                "Page"
            ],
            "commands": [
                {
                    "name": "generateTestReport",
                    "description": "Generates a report for testing.",
                    "parameters": [
                        {
                            "name": "message",
                            "description": "Message to be displayed in the report.",
                            "type": "string"
                        },
                        {
                            "name": "group",
                            "description": "Specifies the endpoint group to deliver the report to.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                }
            ]
        },
        {
            "domain": "Fetch",
            "description": "A domain for letting clients substitute browser's network layer with client code.",
            "experimental": true,
            "dependencies": [
                "Network",
                "IO",
                "Page"
            ],
            "types": [
                {
                    "id": "RequestId",
                    "description": "Unique request identifier.",
                    "type": "string"
                },
                {
                    "id": "RequestStage",
                    "description": "Stages of the request to handle. Request will intercept before the request is\nsent. Response will intercept after the response is received (but before response\nbody is received.",
                    "experimental": true,
                    "type": "string",
                    "enum": [
                        "Request",
                        "Response"
                    ]
                },
                {
                    "id": "RequestPattern",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "urlPattern",
                            "description": "Wildcards ('*' -> zero or more, '?' -> exactly one) are allowed. Escape character is\nbackslash. Omitting is equivalent to \"*\".",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "resourceType",
                            "description": "If set, only requests for matching resource types will be intercepted.",
                            "optional": true,
                            "$ref": "Network.ResourceType"
                        },
                        {
                            "name": "requestStage",
                            "description": "Stage at wich to begin intercepting requests. Default is Request.",
                            "optional": true,
                            "$ref": "RequestStage"
                        }
                    ]
                },
                {
                    "id": "HeaderEntry",
                    "description": "Response HTTP header entry",
                    "type": "object",
                    "properties": [
                        {
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "name": "value",
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "AuthChallenge",
                    "description": "Authorization challenge for HTTP status code 401 or 407.",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "source",
                            "description": "Source of the authentication challenge.",
                            "optional": true,
                            "type": "string",
                            "enum": [
                                "Server",
                                "Proxy"
                            ]
                        },
                        {
                            "name": "origin",
                            "description": "Origin of the challenger.",
                            "type": "string"
                        },
                        {
                            "name": "scheme",
                            "description": "The authentication scheme used, such as basic or digest",
                            "type": "string"
                        },
                        {
                            "name": "realm",
                            "description": "The realm of the challenge. May be empty.",
                            "type": "string"
                        }
                    ]
                },
                {
                    "id": "AuthChallengeResponse",
                    "description": "Response to an AuthChallenge.",
                    "experimental": true,
                    "type": "object",
                    "properties": [
                        {
                            "name": "response",
                            "description": "The decision on what to do in response to the authorization challenge.  Default means\ndeferring to the default behavior of the net stack, which will likely either the Cancel\nauthentication or display a popup dialog box.",
                            "type": "string",
                            "enum": [
                                "Default",
                                "CancelAuth",
                                "ProvideCredentials"
                            ]
                        },
                        {
                            "name": "username",
                            "description": "The username to provide, possibly empty. Should only be set if response is\nProvideCredentials.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "password",
                            "description": "The password to provide, possibly empty. Should only be set if response is\nProvideCredentials.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                }
            ],
            "commands": [
                {
                    "name": "disable",
                    "description": "Disables the fetch domain."
                },
                {
                    "name": "enable",
                    "description": "Enables issuing of requestPaused events. A request will be paused until client\ncalls one of failRequest, fulfillRequest or continueRequest/continueWithAuth.",
                    "parameters": [
                        {
                            "name": "patterns",
                            "description": "If specified, only requests matching any of these patterns will produce\nfetchRequested event and will be paused until clients response. If not set,\nall requests will be affected.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "RequestPattern"
                            }
                        },
                        {
                            "name": "handleAuthRequests",
                            "description": "If true, authRequired events will be issued and requests will be paused\nexpecting a call to continueWithAuth.",
                            "optional": true,
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "failRequest",
                    "description": "Causes the request to fail with specified reason.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "An id the client received in requestPaused event.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "errorReason",
                            "description": "Causes the request to fail with the given reason.",
                            "$ref": "Network.ErrorReason"
                        }
                    ]
                },
                {
                    "name": "fulfillRequest",
                    "description": "Provides response to the request.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "An id the client received in requestPaused event.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "responseCode",
                            "description": "An HTTP response code.",
                            "type": "integer"
                        },
                        {
                            "name": "responseHeaders",
                            "description": "Response headers.",
                            "type": "array",
                            "items": {
                                "$ref": "HeaderEntry"
                            }
                        },
                        {
                            "name": "body",
                            "description": "A response body.",
                            "optional": true,
                            "type": "binary"
                        },
                        {
                            "name": "responsePhrase",
                            "description": "A textual representation of responseCode.\nIf absent, a standard phrase mathcing responseCode is used.",
                            "optional": true,
                            "type": "string"
                        }
                    ]
                },
                {
                    "name": "continueRequest",
                    "description": "Continues the request, optionally modifying some of its parameters.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "An id the client received in requestPaused event.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "url",
                            "description": "If set, the request url will be modified in a way that's not observable by page.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "method",
                            "description": "If set, the request method is overridden.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "postData",
                            "description": "If set, overrides the post data in the request.",
                            "optional": true,
                            "type": "string"
                        },
                        {
                            "name": "headers",
                            "description": "If set, overrides the request headrts.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "HeaderEntry"
                            }
                        }
                    ]
                },
                {
                    "name": "continueWithAuth",
                    "description": "Continues a request supplying authChallengeResponse following authRequired event.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "An id the client received in authRequired event.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "authChallengeResponse",
                            "description": "Response to  with an authChallenge.",
                            "$ref": "AuthChallengeResponse"
                        }
                    ]
                },
                {
                    "name": "getResponseBody",
                    "description": "Causes the body of the response to be received from the server and\nreturned as a single string. May only be issued for a request that\nis paused in the Response stage and is mutually exclusive with\ntakeResponseBodyForInterceptionAsStream. Calling other methods that\naffect the request or disabling fetch domain before body is received\nresults in an undefined behavior.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Identifier for the intercepted request to get body for.",
                            "$ref": "RequestId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "body",
                            "description": "Response body.",
                            "type": "string"
                        },
                        {
                            "name": "base64Encoded",
                            "description": "True, if content was sent as base64.",
                            "type": "boolean"
                        }
                    ]
                },
                {
                    "name": "takeResponseBodyAsStream",
                    "description": "Returns a handle to the stream representing the response body.\nThe request must be paused in the HeadersReceived stage.\nNote that after this command the request can't be continued\nas is -- client either needs to cancel it or to provide the\nresponse body.\nThe stream only supports sequential read, IO.read will fail if the position\nis specified.\nThis method is mutually exclusive with getResponseBody.\nCalling other methods that affect the request or disabling fetch\ndomain before body is received results in an undefined behavior.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "$ref": "RequestId"
                        }
                    ],
                    "returns": [
                        {
                            "name": "stream",
                            "$ref": "IO.StreamHandle"
                        }
                    ]
                }
            ],
            "events": [
                {
                    "name": "requestPaused",
                    "description": "Issued when the domain is enabled and the request URL matches the\nspecified filter. The request is paused until the client responds\nwith one of continueRequest, failRequest or fulfillRequest.\nThe stage of the request can be determined by presence of responseErrorReason\nand responseStatusCode -- the request is at the response stage if either\nof these fields is present and in the request stage otherwise.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Each request the page makes will have a unique id.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "request",
                            "description": "The details of the request.",
                            "$ref": "Network.Request"
                        },
                        {
                            "name": "frameId",
                            "description": "The id of the frame that initiated the request.",
                            "$ref": "Page.FrameId"
                        },
                        {
                            "name": "resourceType",
                            "description": "How the requested resource will be used.",
                            "$ref": "Network.ResourceType"
                        },
                        {
                            "name": "responseErrorReason",
                            "description": "Response error if intercepted at response stage.",
                            "optional": true,
                            "$ref": "Network.ErrorReason"
                        },
                        {
                            "name": "responseStatusCode",
                            "description": "Response code if intercepted at response stage.",
                            "optional": true,
                            "type": "integer"
                        },
                        {
                            "name": "responseHeaders",
                            "description": "Response headers if intercepted at the response stage.",
                            "optional": true,
                            "type": "array",
                            "items": {
                                "$ref": "HeaderEntry"
                            }
                        }
                    ]
                },
                {
                    "name": "authRequired",
                    "description": "Issued when the domain is enabled with handleAuthRequests set to true.\nThe request is paused until client responds with continueWithAuth.",
                    "parameters": [
                        {
                            "name": "requestId",
                            "description": "Each request the page makes will have a unique id.",
                            "$ref": "RequestId"
                        },
                        {
                            "name": "request",
                            "description": "The details of the request.",
                            "$ref": "Network.Request"
                        },
                        {
                            "name": "frameId",
                            "description": "The id of the frame that initiated the request.",
                            "$ref": "Page.FrameId"
                        },
                        {
                            "name": "resourceType",
                            "description": "How the requested resource will be used.",
                            "$ref": "Network.ResourceType"
                        },
                        {
                            "name": "authChallenge",
                            "description": "Details of the Authorization Challenge encountered.\nIf this is set, client should respond with continueRequest that\ncontains AuthChallengeResponse.",
                            "$ref": "AuthChallenge"
                        }
                    ]
                }
            ]
        },
        {
            "commands": [
                {
                    "name": "clearMessages",
                    "description": "Does nothing."
                },
                {
                    "name": "disable",
                    "description": "Disables console domain, prevents further console messages from being reported to the client."
                },
                {
                    "name": "enable",
                    "description": "Enables console domain, sends the messages collected so far to the client by means of the\n`messageAdded` notification."
                }
            ],
            "description": "This domain is deprecated - use Runtime or Log instead.",
            "deprecated": true,
            "domain": "Console",
            "dependencies": [
                "Runtime"
            ],
            "events": [
                {
                    "name": "messageAdded",
                    "parameters": [
                        {
                            "$ref": "ConsoleMessage",
                            "name": "message",
                            "description": "Console message that has been added."
                        }
                    ],
                    "description": "Issued when new console message is added."
                }
            ],
            "types": [
                {
                    "properties": [
                        {
                            "enum": [
                                "xml",
                                "javascript",
                                "network",
                                "console-api",
                                "storage",
                                "appcache",
                                "rendering",
                                "security",
                                "other",
                                "deprecation",
                                "worker"
                            ],
                            "type": "string",
                            "name": "source",
                            "description": "Message source."
                        },
                        {
                            "enum": [
                                "log",
                                "warning",
                                "error",
                                "debug",
                                "info"
                            ],
                            "type": "string",
                            "name": "level",
                            "description": "Message severity."
                        },
                        {
                            "type": "string",
                            "name": "text",
                            "description": "Message text."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "url",
                            "description": "URL of the message origin."
                        },
                        {
                            "type": "integer",
                            "optional": true,
                            "name": "line",
                            "description": "Line number in the resource that generated this message (1-based)."
                        },
                        {
                            "type": "integer",
                            "optional": true,
                            "name": "column",
                            "description": "Column number in the resource that generated this message (1-based)."
                        }
                    ],
                    "type": "object",
                    "id": "ConsoleMessage",
                    "description": "Console message."
                }
            ]
        },
        {
            "commands": [
                {
                    "name": "continueToLocation",
                    "parameters": [
                        {
                            "$ref": "Location",
                            "name": "location",
                            "description": "Location to continue to."
                        },
                        {
                            "type": "string",
                            "enum": [
                                "any",
                                "current"
                            ],
                            "optional": true,
                            "name": "targetCallFrames"
                        }
                    ],
                    "description": "Continues execution until specific location is reached."
                },
                {
                    "name": "disable",
                    "description": "Disables debugger for given page."
                },
                {
                    "returns": [
                        {
                            "$ref": "Runtime.UniqueDebuggerId",
                            "name": "debuggerId",
                            "experimental": true,
                            "description": "Unique identifier of the debugger."
                        }
                    ],
                    "name": "enable",
                    "description": "Enables debugger for the given page. Clients should not assume that the debugging has been\nenabled until the result for this command is received."
                },
                {
                    "returns": [
                        {
                            "$ref": "Runtime.RemoteObject",
                            "name": "result",
                            "description": "Object wrapper for the evaluation result."
                        },
                        {
                            "$ref": "Runtime.ExceptionDetails",
                            "optional": true,
                            "name": "exceptionDetails",
                            "description": "Exception details."
                        }
                    ],
                    "name": "evaluateOnCallFrame",
                    "parameters": [
                        {
                            "$ref": "CallFrameId",
                            "name": "callFrameId",
                            "description": "Call frame identifier to evaluate on."
                        },
                        {
                            "type": "string",
                            "name": "expression",
                            "description": "Expression to evaluate."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "objectGroup",
                            "description": "String object group name to put result into (allows rapid releasing resulting object handles\nusing `releaseObjectGroup`)."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "includeCommandLineAPI",
                            "description": "Specifies whether command line API should be available to the evaluated expression, defaults\nto false."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "silent",
                            "description": "In silent mode exceptions thrown during evaluation are not reported and do not pause\nexecution. Overrides `setPauseOnException` state."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "returnByValue",
                            "description": "Whether the result is expected to be a JSON object that should be sent by value."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "generatePreview",
                            "experimental": true,
                            "description": "Whether preview should be generated for the result."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "throwOnSideEffect",
                            "description": "Whether to throw an exception if side effect cannot be ruled out during evaluation."
                        },
                        {
                            "$ref": "Runtime.TimeDelta",
                            "optional": true,
                            "name": "timeout",
                            "experimental": true,
                            "description": "Terminate execution after timing out (number of milliseconds)."
                        }
                    ],
                    "description": "Evaluates expression on a given call frame."
                },
                {
                    "returns": [
                        {
                            "items": {
                                "$ref": "BreakLocation"
                            },
                            "type": "array",
                            "name": "locations",
                            "description": "List of the possible breakpoint locations."
                        }
                    ],
                    "name": "getPossibleBreakpoints",
                    "parameters": [
                        {
                            "$ref": "Location",
                            "name": "start",
                            "description": "Start of range to search possible breakpoint locations in."
                        },
                        {
                            "$ref": "Location",
                            "optional": true,
                            "name": "end",
                            "description": "End of range to search possible breakpoint locations in (excluding). When not specified, end\nof scripts is used as end of range."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "restrictToFunction",
                            "description": "Only consider locations which are in the same (non-nested) function as start."
                        }
                    ],
                    "description": "Returns possible locations for breakpoint. scriptId in start and end range locations should be\nthe same."
                },
                {
                    "returns": [
                        {
                            "type": "string",
                            "name": "scriptSource",
                            "description": "Script source."
                        }
                    ],
                    "name": "getScriptSource",
                    "parameters": [
                        {
                            "$ref": "Runtime.ScriptId",
                            "name": "scriptId",
                            "description": "Id of the script to get source for."
                        }
                    ],
                    "description": "Returns source for the script with given id."
                },
                {
                    "returns": [
                        {
                            "name": "stackTrace",
                            "$ref": "Runtime.StackTrace"
                        }
                    ],
                    "parameters": [
                        {
                            "name": "stackTraceId",
                            "$ref": "Runtime.StackTraceId"
                        }
                    ],
                    "name": "getStackTrace",
                    "experimental": true,
                    "description": "Returns stack trace with given `stackTraceId`."
                },
                {
                    "name": "pause",
                    "description": "Stops on the next JavaScript statement."
                },
                {
                    "parameters": [
                        {
                            "$ref": "Runtime.StackTraceId",
                            "name": "parentStackTraceId",
                            "description": "Debugger will pause when async call with given stack trace is started."
                        }
                    ],
                    "name": "pauseOnAsyncCall",
                    "experimental": true
                },
                {
                    "name": "removeBreakpoint",
                    "parameters": [
                        {
                            "name": "breakpointId",
                            "$ref": "BreakpointId"
                        }
                    ],
                    "description": "Removes JavaScript breakpoint."
                },
                {
                    "returns": [
                        {
                            "items": {
                                "$ref": "CallFrame"
                            },
                            "type": "array",
                            "name": "callFrames",
                            "description": "New stack trace."
                        },
                        {
                            "$ref": "Runtime.StackTrace",
                            "optional": true,
                            "name": "asyncStackTrace",
                            "description": "Async stack trace, if any."
                        },
                        {
                            "$ref": "Runtime.StackTraceId",
                            "optional": true,
                            "name": "asyncStackTraceId",
                            "experimental": true,
                            "description": "Async stack trace, if any."
                        }
                    ],
                    "name": "restartFrame",
                    "parameters": [
                        {
                            "$ref": "CallFrameId",
                            "name": "callFrameId",
                            "description": "Call frame identifier to evaluate on."
                        }
                    ],
                    "description": "Restarts particular call frame from the beginning."
                },
                {
                    "name": "resume",
                    "description": "Resumes JavaScript execution."
                },
                {
                    "name": "scheduleStepIntoAsync",
                    "experimental": true,
                    "description": "This method is deprecated - use Debugger.stepInto with breakOnAsyncCall and\nDebugger.pauseOnAsyncTask instead. Steps into next scheduled async task if any is scheduled\nbefore next pause. Returns success when async task is actually scheduled, returns error if no\ntask were scheduled or another scheduleStepIntoAsync was called."
                },
                {
                    "returns": [
                        {
                            "items": {
                                "$ref": "SearchMatch"
                            },
                            "type": "array",
                            "name": "result",
                            "description": "List of search matches."
                        }
                    ],
                    "name": "searchInContent",
                    "parameters": [
                        {
                            "$ref": "Runtime.ScriptId",
                            "name": "scriptId",
                            "description": "Id of the script to search in."
                        },
                        {
                            "type": "string",
                            "name": "query",
                            "description": "String to search for."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "caseSensitive",
                            "description": "If true, search is case sensitive."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "isRegex",
                            "description": "If true, treats string parameter as regex."
                        }
                    ],
                    "description": "Searches for given string in script content."
                },
                {
                    "name": "setAsyncCallStackDepth",
                    "parameters": [
                        {
                            "type": "integer",
                            "name": "maxDepth",
                            "description": "Maximum depth of async call stacks. Setting to `0` will effectively disable collecting async\ncall stacks (default)."
                        }
                    ],
                    "description": "Enables or disables async call stacks tracking."
                },
                {
                    "parameters": [
                        {
                            "items": {
                                "type": "string"
                            },
                            "type": "array",
                            "name": "patterns",
                            "description": "Array of regexps that will be used to check script url for blackbox state."
                        }
                    ],
                    "name": "setBlackboxPatterns",
                    "experimental": true,
                    "description": "Replace previous blackbox patterns with passed ones. Forces backend to skip stepping/pausing in\nscripts with url matching one of the patterns. VM will try to leave blackboxed script by\nperforming 'step in' several times, finally resorting to 'step out' if unsuccessful."
                },
                {
                    "parameters": [
                        {
                            "$ref": "Runtime.ScriptId",
                            "name": "scriptId",
                            "description": "Id of the script."
                        },
                        {
                            "items": {
                                "$ref": "ScriptPosition"
                            },
                            "type": "array",
                            "name": "positions"
                        }
                    ],
                    "name": "setBlackboxedRanges",
                    "experimental": true,
                    "description": "Makes backend skip steps in the script in blackboxed ranges. VM will try leave blacklisted\nscripts by performing 'step in' several times, finally resorting to 'step out' if unsuccessful.\nPositions array contains positions where blackbox state is changed. First interval isn't\nblackboxed. Array should be sorted."
                },
                {
                    "returns": [
                        {
                            "$ref": "BreakpointId",
                            "name": "breakpointId",
                            "description": "Id of the created breakpoint for further reference."
                        },
                        {
                            "$ref": "Location",
                            "name": "actualLocation",
                            "description": "Location this breakpoint resolved into."
                        }
                    ],
                    "name": "setBreakpoint",
                    "parameters": [
                        {
                            "$ref": "Location",
                            "name": "location",
                            "description": "Location to set breakpoint in."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "condition",
                            "description": "Expression to use as a breakpoint condition. When specified, debugger will only stop on the\nbreakpoint if this expression evaluates to true."
                        }
                    ],
                    "description": "Sets JavaScript breakpoint at a given location."
                },
                {
                    "returns": [
                        {
                            "$ref": "BreakpointId",
                            "name": "breakpointId",
                            "description": "Id of the created breakpoint for further reference."
                        },
                        {
                            "items": {
                                "$ref": "Location"
                            },
                            "type": "array",
                            "name": "locations",
                            "description": "List of the locations this breakpoint resolved into upon addition."
                        }
                    ],
                    "name": "setBreakpointByUrl",
                    "parameters": [
                        {
                            "type": "integer",
                            "name": "lineNumber",
                            "description": "Line number to set breakpoint at."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "url",
                            "description": "URL of the resources to set breakpoint on."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "urlRegex",
                            "description": "Regex pattern for the URLs of the resources to set breakpoints on. Either `url` or\n`urlRegex` must be specified."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "scriptHash",
                            "description": "Script hash of the resources to set breakpoint on."
                        },
                        {
                            "type": "integer",
                            "optional": true,
                            "name": "columnNumber",
                            "description": "Offset in the line to set breakpoint at."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "condition",
                            "description": "Expression to use as a breakpoint condition. When specified, debugger will only stop on the\nbreakpoint if this expression evaluates to true."
                        }
                    ],
                    "description": "Sets JavaScript breakpoint at given location specified either by URL or URL regex. Once this\ncommand is issued, all existing parsed scripts will have breakpoints resolved and returned in\n`locations` property. Further matching script parsing will result in subsequent\n`breakpointResolved` events issued. This logical breakpoint will survive page reloads."
                },
                {
                    "returns": [
                        {
                            "$ref": "BreakpointId",
                            "name": "breakpointId",
                            "description": "Id of the created breakpoint for further reference."
                        }
                    ],
                    "parameters": [
                        {
                            "$ref": "Runtime.RemoteObjectId",
                            "name": "objectId",
                            "description": "Function object id."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "condition",
                            "description": "Expression to use as a breakpoint condition. When specified, debugger will\nstop on the breakpoint if this expression evaluates to true."
                        }
                    ],
                    "name": "setBreakpointOnFunctionCall",
                    "experimental": true,
                    "description": "Sets JavaScript breakpoint before each call to the given function.\nIf another function was created from the same source as a given one,\ncalling it will also trigger the breakpoint."
                },
                {
                    "name": "setBreakpointsActive",
                    "parameters": [
                        {
                            "type": "boolean",
                            "name": "active",
                            "description": "New value for breakpoints active state."
                        }
                    ],
                    "description": "Activates / deactivates all breakpoints on the page."
                },
                {
                    "name": "setPauseOnExceptions",
                    "parameters": [
                        {
                            "enum": [
                                "none",
                                "uncaught",
                                "all"
                            ],
                            "type": "string",
                            "name": "state",
                            "description": "Pause on exceptions mode."
                        }
                    ],
                    "description": "Defines pause on exceptions state. Can be set to stop on all exceptions, uncaught exceptions or\nno exceptions. Initial pause on exceptions state is `none`."
                },
                {
                    "parameters": [
                        {
                            "$ref": "Runtime.CallArgument",
                            "name": "newValue",
                            "description": "New return value."
                        }
                    ],
                    "name": "setReturnValue",
                    "experimental": true,
                    "description": "Changes return value in top frame. Available only at return break position."
                },
                {
                    "returns": [
                        {
                            "type": "array",
                            "items": {
                                "$ref": "CallFrame"
                            },
                            "optional": true,
                            "name": "callFrames",
                            "description": "New stack trace in case editing has happened while VM was stopped."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "stackChanged",
                            "description": "Whether current call stack  was modified after applying the changes."
                        },
                        {
                            "$ref": "Runtime.StackTrace",
                            "optional": true,
                            "name": "asyncStackTrace",
                            "description": "Async stack trace, if any."
                        },
                        {
                            "$ref": "Runtime.StackTraceId",
                            "optional": true,
                            "name": "asyncStackTraceId",
                            "experimental": true,
                            "description": "Async stack trace, if any."
                        },
                        {
                            "$ref": "Runtime.ExceptionDetails",
                            "optional": true,
                            "name": "exceptionDetails",
                            "description": "Exception details if any."
                        }
                    ],
                    "name": "setScriptSource",
                    "parameters": [
                        {
                            "$ref": "Runtime.ScriptId",
                            "name": "scriptId",
                            "description": "Id of the script to edit."
                        },
                        {
                            "type": "string",
                            "name": "scriptSource",
                            "description": "New content of the script."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "dryRun",
                            "description": "If true the change will not actually be applied. Dry run may be used to get result\ndescription without actually modifying the code."
                        }
                    ],
                    "description": "Edits JavaScript source live."
                },
                {
                    "name": "setSkipAllPauses",
                    "parameters": [
                        {
                            "type": "boolean",
                            "name": "skip",
                            "description": "New value for skip pauses state."
                        }
                    ],
                    "description": "Makes page not interrupt on any pauses (breakpoint, exception, dom exception etc)."
                },
                {
                    "name": "setVariableValue",
                    "parameters": [
                        {
                            "type": "integer",
                            "name": "scopeNumber",
                            "description": "0-based number of scope as was listed in scope chain. Only 'local', 'closure' and 'catch'\nscope types are allowed. Other scopes could be manipulated manually."
                        },
                        {
                            "type": "string",
                            "name": "variableName",
                            "description": "Variable name."
                        },
                        {
                            "$ref": "Runtime.CallArgument",
                            "name": "newValue",
                            "description": "New variable value."
                        },
                        {
                            "$ref": "CallFrameId",
                            "name": "callFrameId",
                            "description": "Id of callframe that holds variable."
                        }
                    ],
                    "description": "Changes value of variable in a callframe. Object-based scopes are not supported and must be\nmutated manually."
                },
                {
                    "name": "stepInto",
                    "parameters": [
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "breakOnAsyncCall",
                            "experimental": true,
                            "description": "Debugger will issue additional Debugger.paused notification if any async task is scheduled\nbefore next pause."
                        }
                    ],
                    "description": "Steps into the function call."
                },
                {
                    "name": "stepOut",
                    "description": "Steps out of the function call."
                },
                {
                    "name": "stepOver",
                    "description": "Steps over the statement."
                }
            ],
            "description": "Debugger domain exposes JavaScript debugging capabilities. It allows setting and removing\nbreakpoints, stepping through execution, exploring stack traces, etc.",
            "domain": "Debugger",
            "dependencies": [
                "Runtime"
            ],
            "events": [
                {
                    "name": "breakpointResolved",
                    "parameters": [
                        {
                            "$ref": "BreakpointId",
                            "name": "breakpointId",
                            "description": "Breakpoint unique identifier."
                        },
                        {
                            "$ref": "Location",
                            "name": "location",
                            "description": "Actual breakpoint location."
                        }
                    ],
                    "description": "Fired when breakpoint is resolved to an actual script and location."
                },
                {
                    "name": "paused",
                    "parameters": [
                        {
                            "items": {
                                "$ref": "CallFrame"
                            },
                            "type": "array",
                            "name": "callFrames",
                            "description": "Call stack the virtual machine stopped on."
                        },
                        {
                            "enum": [
                                "XHR",
                                "DOM",
                                "EventListener",
                                "exception",
                                "assert",
                                "debugCommand",
                                "promiseRejection",
                                "OOM",
                                "other",
                                "ambiguous"
                            ],
                            "type": "string",
                            "name": "reason",
                            "description": "Pause reason."
                        },
                        {
                            "type": "object",
                            "optional": true,
                            "name": "data",
                            "description": "Object containing break-specific auxiliary properties."
                        },
                        {
                            "type": "array",
                            "items": {
                                "type": "string"
                            },
                            "optional": true,
                            "name": "hitBreakpoints",
                            "description": "Hit breakpoints IDs"
                        },
                        {
                            "$ref": "Runtime.StackTrace",
                            "optional": true,
                            "name": "asyncStackTrace",
                            "description": "Async stack trace, if any."
                        },
                        {
                            "$ref": "Runtime.StackTraceId",
                            "optional": true,
                            "name": "asyncStackTraceId",
                            "experimental": true,
                            "description": "Async stack trace, if any."
                        },
                        {
                            "$ref": "Runtime.StackTraceId",
                            "optional": true,
                            "name": "asyncCallStackTraceId",
                            "experimental": true,
                            "description": "Just scheduled async call will have this stack trace as parent stack during async execution.\nThis field is available only after `Debugger.stepInto` call with `breakOnAsynCall` flag."
                        }
                    ],
                    "description": "Fired when the virtual machine stopped on breakpoint or exception or any other stop criteria."
                },
                {
                    "name": "resumed",
                    "description": "Fired when the virtual machine resumed execution."
                },
                {
                    "name": "scriptFailedToParse",
                    "parameters": [
                        {
                            "$ref": "Runtime.ScriptId",
                            "name": "scriptId",
                            "description": "Identifier of the script parsed."
                        },
                        {
                            "type": "string",
                            "name": "url",
                            "description": "URL or name of the script parsed (if any)."
                        },
                        {
                            "type": "integer",
                            "name": "startLine",
                            "description": "Line offset of the script within the resource with given URL (for script tags)."
                        },
                        {
                            "type": "integer",
                            "name": "startColumn",
                            "description": "Column offset of the script within the resource with given URL."
                        },
                        {
                            "type": "integer",
                            "name": "endLine",
                            "description": "Last line of the script."
                        },
                        {
                            "type": "integer",
                            "name": "endColumn",
                            "description": "Length of the last line of the script."
                        },
                        {
                            "$ref": "Runtime.ExecutionContextId",
                            "name": "executionContextId",
                            "description": "Specifies script creation context."
                        },
                        {
                            "type": "string",
                            "name": "hash",
                            "description": "Content hash of the script."
                        },
                        {
                            "type": "object",
                            "optional": true,
                            "name": "executionContextAuxData",
                            "description": "Embedder-specific auxiliary data."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "sourceMapURL",
                            "description": "URL of source map associated with script (if any)."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "hasSourceURL",
                            "description": "True, if this script has sourceURL."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "isModule",
                            "description": "True, if this script is ES6 module."
                        },
                        {
                            "type": "integer",
                            "optional": true,
                            "name": "length",
                            "description": "This script length."
                        },
                        {
                            "$ref": "Runtime.StackTrace",
                            "optional": true,
                            "name": "stackTrace",
                            "experimental": true,
                            "description": "JavaScript top stack frame of where the script parsed event was triggered if available."
                        }
                    ],
                    "description": "Fired when virtual machine fails to parse the script."
                },
                {
                    "name": "scriptParsed",
                    "parameters": [
                        {
                            "$ref": "Runtime.ScriptId",
                            "name": "scriptId",
                            "description": "Identifier of the script parsed."
                        },
                        {
                            "type": "string",
                            "name": "url",
                            "description": "URL or name of the script parsed (if any)."
                        },
                        {
                            "type": "integer",
                            "name": "startLine",
                            "description": "Line offset of the script within the resource with given URL (for script tags)."
                        },
                        {
                            "type": "integer",
                            "name": "startColumn",
                            "description": "Column offset of the script within the resource with given URL."
                        },
                        {
                            "type": "integer",
                            "name": "endLine",
                            "description": "Last line of the script."
                        },
                        {
                            "type": "integer",
                            "name": "endColumn",
                            "description": "Length of the last line of the script."
                        },
                        {
                            "$ref": "Runtime.ExecutionContextId",
                            "name": "executionContextId",
                            "description": "Specifies script creation context."
                        },
                        {
                            "type": "string",
                            "name": "hash",
                            "description": "Content hash of the script."
                        },
                        {
                            "type": "object",
                            "optional": true,
                            "name": "executionContextAuxData",
                            "description": "Embedder-specific auxiliary data."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "isLiveEdit",
                            "experimental": true,
                            "description": "True, if this script is generated as a result of the live edit operation."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "sourceMapURL",
                            "description": "URL of source map associated with script (if any)."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "hasSourceURL",
                            "description": "True, if this script has sourceURL."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "isModule",
                            "description": "True, if this script is ES6 module."
                        },
                        {
                            "type": "integer",
                            "optional": true,
                            "name": "length",
                            "description": "This script length."
                        },
                        {
                            "$ref": "Runtime.StackTrace",
                            "optional": true,
                            "name": "stackTrace",
                            "experimental": true,
                            "description": "JavaScript top stack frame of where the script parsed event was triggered if available."
                        }
                    ],
                    "description": "Fired when virtual machine parses script. This event is also fired for all known and uncollected\nscripts upon enabling debugger."
                }
            ],
            "types": [
                {
                    "type": "string",
                    "id": "BreakpointId",
                    "description": "Breakpoint identifier."
                },
                {
                    "type": "string",
                    "id": "CallFrameId",
                    "description": "Call frame identifier."
                },
                {
                    "properties": [
                        {
                            "$ref": "Runtime.ScriptId",
                            "name": "scriptId",
                            "description": "Script identifier as reported in the `Debugger.scriptParsed`."
                        },
                        {
                            "type": "integer",
                            "name": "lineNumber",
                            "description": "Line number in the script (0-based)."
                        },
                        {
                            "type": "integer",
                            "optional": true,
                            "name": "columnNumber",
                            "description": "Column number in the script (0-based)."
                        }
                    ],
                    "type": "object",
                    "id": "Location",
                    "description": "Location in the source code."
                },
                {
                    "properties": [
                        {
                            "type": "integer",
                            "name": "lineNumber"
                        },
                        {
                            "type": "integer",
                            "name": "columnNumber"
                        }
                    ],
                    "type": "object",
                    "id": "ScriptPosition",
                    "experimental": true,
                    "description": "Location in the source code."
                },
                {
                    "properties": [
                        {
                            "$ref": "CallFrameId",
                            "name": "callFrameId",
                            "description": "Call frame identifier. This identifier is only valid while the virtual machine is paused."
                        },
                        {
                            "type": "string",
                            "name": "functionName",
                            "description": "Name of the JavaScript function called on this call frame."
                        },
                        {
                            "$ref": "Location",
                            "optional": true,
                            "name": "functionLocation",
                            "description": "Location in the source code."
                        },
                        {
                            "$ref": "Location",
                            "name": "location",
                            "description": "Location in the source code."
                        },
                        {
                            "type": "string",
                            "name": "url",
                            "description": "JavaScript script name or url."
                        },
                        {
                            "items": {
                                "$ref": "Scope"
                            },
                            "type": "array",
                            "name": "scopeChain",
                            "description": "Scope chain for this call frame."
                        },
                        {
                            "$ref": "Runtime.RemoteObject",
                            "name": "this",
                            "description": "`this` object for this call frame."
                        },
                        {
                            "$ref": "Runtime.RemoteObject",
                            "optional": true,
                            "name": "returnValue",
                            "description": "The value being returned, if the function is at return point."
                        }
                    ],
                    "type": "object",
                    "id": "CallFrame",
                    "description": "JavaScript call frame. Array of call frames form the call stack."
                },
                {
                    "properties": [
                        {
                            "enum": [
                                "global",
                                "local",
                                "with",
                                "closure",
                                "catch",
                                "block",
                                "script",
                                "eval",
                                "module"
                            ],
                            "type": "string",
                            "name": "type",
                            "description": "Scope type."
                        },
                        {
                            "$ref": "Runtime.RemoteObject",
                            "name": "object",
                            "description": "Object representing the scope. For `global` and `with` scopes it represents the actual\nobject; for the rest of the scopes, it is artificial transient object enumerating scope\nvariables as its properties."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "name"
                        },
                        {
                            "$ref": "Location",
                            "optional": true,
                            "name": "startLocation",
                            "description": "Location in the source code where scope starts"
                        },
                        {
                            "$ref": "Location",
                            "optional": true,
                            "name": "endLocation",
                            "description": "Location in the source code where scope ends"
                        }
                    ],
                    "type": "object",
                    "id": "Scope",
                    "description": "Scope description."
                },
                {
                    "properties": [
                        {
                            "type": "number",
                            "name": "lineNumber",
                            "description": "Line number in resource content."
                        },
                        {
                            "type": "string",
                            "name": "lineContent",
                            "description": "Line with match content."
                        }
                    ],
                    "type": "object",
                    "id": "SearchMatch",
                    "description": "Search match for resource."
                },
                {
                    "type": "object",
                    "id": "BreakLocation",
                    "properties": [
                        {
                            "$ref": "Runtime.ScriptId",
                            "name": "scriptId",
                            "description": "Script identifier as reported in the `Debugger.scriptParsed`."
                        },
                        {
                            "type": "integer",
                            "name": "lineNumber",
                            "description": "Line number in the script (0-based)."
                        },
                        {
                            "type": "integer",
                            "optional": true,
                            "name": "columnNumber",
                            "description": "Column number in the script (0-based)."
                        },
                        {
                            "type": "string",
                            "enum": [
                                "debuggerStatement",
                                "call",
                                "return"
                            ],
                            "optional": true,
                            "name": "type"
                        }
                    ]
                }
            ]
        },
        {
            "commands": [
                {
                    "name": "addInspectedHeapObject",
                    "parameters": [
                        {
                            "$ref": "HeapSnapshotObjectId",
                            "name": "heapObjectId",
                            "description": "Heap snapshot object id to be accessible by means of $x command line API."
                        }
                    ],
                    "description": "Enables console to refer to the node with given id via $x (see Command Line API for more details\n$x functions)."
                },
                {
                    "name": "collectGarbage"
                },
                {
                    "name": "disable"
                },
                {
                    "name": "enable"
                },
                {
                    "returns": [
                        {
                            "$ref": "HeapSnapshotObjectId",
                            "name": "heapSnapshotObjectId",
                            "description": "Id of the heap snapshot object corresponding to the passed remote object id."
                        }
                    ],
                    "name": "getHeapObjectId",
                    "parameters": [
                        {
                            "$ref": "Runtime.RemoteObjectId",
                            "name": "objectId",
                            "description": "Identifier of the object to get heap object id for."
                        }
                    ]
                },
                {
                    "returns": [
                        {
                            "$ref": "Runtime.RemoteObject",
                            "name": "result",
                            "description": "Evaluation result."
                        }
                    ],
                    "name": "getObjectByHeapObjectId",
                    "parameters": [
                        {
                            "name": "objectId",
                            "$ref": "HeapSnapshotObjectId"
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "objectGroup",
                            "description": "Symbolic group name that can be used to release multiple objects."
                        }
                    ]
                },
                {
                    "returns": [
                        {
                            "$ref": "SamplingHeapProfile",
                            "name": "profile",
                            "description": "Return the sampling profile being collected."
                        }
                    ],
                    "name": "getSamplingProfile"
                },
                {
                    "name": "startSampling",
                    "parameters": [
                        {
                            "type": "number",
                            "optional": true,
                            "name": "samplingInterval",
                            "description": "Average sample interval in bytes. Poisson distribution is used for the intervals. The\ndefault value is 32768 bytes."
                        }
                    ]
                },
                {
                    "name": "startTrackingHeapObjects",
                    "parameters": [
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "trackAllocations"
                        }
                    ]
                },
                {
                    "returns": [
                        {
                            "$ref": "SamplingHeapProfile",
                            "name": "profile",
                            "description": "Recorded sampling heap profile."
                        }
                    ],
                    "name": "stopSampling"
                },
                {
                    "name": "stopTrackingHeapObjects",
                    "parameters": [
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "reportProgress",
                            "description": "If true 'reportHeapSnapshotProgress' events will be generated while snapshot is being taken\nwhen the tracking is stopped."
                        }
                    ]
                },
                {
                    "name": "takeHeapSnapshot",
                    "parameters": [
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "reportProgress",
                            "description": "If true 'reportHeapSnapshotProgress' events will be generated while snapshot is being taken."
                        }
                    ]
                }
            ],
            "domain": "HeapProfiler",
            "dependencies": [
                "Runtime"
            ],
            "experimental": true,
            "events": [
                {
                    "name": "addHeapSnapshotChunk",
                    "parameters": [
                        {
                            "type": "string",
                            "name": "chunk"
                        }
                    ]
                },
                {
                    "name": "heapStatsUpdate",
                    "parameters": [
                        {
                            "items": {
                                "type": "integer"
                            },
                            "type": "array",
                            "name": "statsUpdate",
                            "description": "An array of triplets. Each triplet describes a fragment. The first integer is the fragment\nindex, the second integer is a total count of objects for the fragment, the third integer is\na total size of the objects for the fragment."
                        }
                    ],
                    "description": "If heap objects tracking has been started then backend may send update for one or more fragments"
                },
                {
                    "name": "lastSeenObjectId",
                    "parameters": [
                        {
                            "type": "integer",
                            "name": "lastSeenObjectId"
                        },
                        {
                            "type": "number",
                            "name": "timestamp"
                        }
                    ],
                    "description": "If heap objects tracking has been started then backend regularly sends a current value for last\nseen object id and corresponding timestamp. If the were changes in the heap since last event\nthen one or more heapStatsUpdate events will be sent before a new lastSeenObjectId event."
                },
                {
                    "name": "reportHeapSnapshotProgress",
                    "parameters": [
                        {
                            "type": "integer",
                            "name": "done"
                        },
                        {
                            "type": "integer",
                            "name": "total"
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "finished"
                        }
                    ]
                },
                {
                    "name": "resetProfiles"
                }
            ],
            "types": [
                {
                    "type": "string",
                    "id": "HeapSnapshotObjectId",
                    "description": "Heap snapshot object id."
                },
                {
                    "properties": [
                        {
                            "$ref": "Runtime.CallFrame",
                            "name": "callFrame",
                            "description": "Function location."
                        },
                        {
                            "type": "number",
                            "name": "selfSize",
                            "description": "Allocations size in bytes for the node excluding children."
                        },
                        {
                            "type": "integer",
                            "name": "id",
                            "description": "Node id. Ids are unique across all profiles collected between startSampling and stopSampling."
                        },
                        {
                            "items": {
                                "$ref": "SamplingHeapProfileNode"
                            },
                            "type": "array",
                            "name": "children",
                            "description": "Child nodes."
                        }
                    ],
                    "type": "object",
                    "id": "SamplingHeapProfileNode",
                    "description": "Sampling Heap Profile node. Holds callsite information, allocation statistics and child nodes."
                },
                {
                    "properties": [
                        {
                            "type": "number",
                            "name": "size",
                            "description": "Allocation size in bytes attributed to the sample."
                        },
                        {
                            "type": "integer",
                            "name": "nodeId",
                            "description": "Id of the corresponding profile tree node."
                        },
                        {
                            "type": "number",
                            "name": "ordinal",
                            "description": "Time-ordered sample ordinal number. It is unique across all profiles retrieved\nbetween startSampling and stopSampling."
                        }
                    ],
                    "type": "object",
                    "id": "SamplingHeapProfileSample",
                    "description": "A single sample from a sampling profile."
                },
                {
                    "properties": [
                        {
                            "name": "head",
                            "$ref": "SamplingHeapProfileNode"
                        },
                        {
                            "items": {
                                "$ref": "SamplingHeapProfileSample"
                            },
                            "type": "array",
                            "name": "samples"
                        }
                    ],
                    "type": "object",
                    "id": "SamplingHeapProfile",
                    "description": "Sampling profile."
                }
            ]
        },
        {
            "domain": "Profiler",
            "dependencies": [
                "Runtime",
                "Debugger"
            ],
            "commands": [
                {
                    "name": "disable"
                },
                {
                    "name": "enable"
                },
                {
                    "returns": [
                        {
                            "items": {
                                "$ref": "ScriptCoverage"
                            },
                            "type": "array",
                            "name": "result",
                            "description": "Coverage data for the current isolate."
                        }
                    ],
                    "name": "getBestEffortCoverage",
                    "description": "Collect coverage data for the current isolate. The coverage data may be incomplete due to\ngarbage collection."
                },
                {
                    "name": "setSamplingInterval",
                    "parameters": [
                        {
                            "type": "integer",
                            "name": "interval",
                            "description": "New sampling interval in microseconds."
                        }
                    ],
                    "description": "Changes CPU profiler sampling interval. Must be called before CPU profiles recording started."
                },
                {
                    "name": "start"
                },
                {
                    "name": "startPreciseCoverage",
                    "parameters": [
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "callCount",
                            "description": "Collect accurate call counts beyond simple 'covered' or 'not covered'."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "detailed",
                            "description": "Collect block-based coverage."
                        }
                    ],
                    "description": "Enable precise code coverage. Coverage data for JavaScript executed before enabling precise code\ncoverage may be incomplete. Enabling prevents running optimized code and resets execution\ncounters."
                },
                {
                    "name": "startTypeProfile",
                    "experimental": true,
                    "description": "Enable type profile."
                },
                {
                    "returns": [
                        {
                            "$ref": "Profile",
                            "name": "profile",
                            "description": "Recorded profile."
                        }
                    ],
                    "name": "stop"
                },
                {
                    "name": "stopPreciseCoverage",
                    "description": "Disable precise code coverage. Disabling releases unnecessary execution count records and allows\nexecuting optimized code."
                },
                {
                    "name": "stopTypeProfile",
                    "experimental": true,
                    "description": "Disable type profile. Disabling releases type profile data collected so far."
                },
                {
                    "returns": [
                        {
                            "items": {
                                "$ref": "ScriptCoverage"
                            },
                            "type": "array",
                            "name": "result",
                            "description": "Coverage data for the current isolate."
                        }
                    ],
                    "name": "takePreciseCoverage",
                    "description": "Collect coverage data for the current isolate, and resets execution counters. Precise code\ncoverage needs to have started."
                },
                {
                    "returns": [
                        {
                            "items": {
                                "$ref": "ScriptTypeProfile"
                            },
                            "type": "array",
                            "name": "result",
                            "description": "Type profile for all scripts since startTypeProfile() was turned on."
                        }
                    ],
                    "name": "takeTypeProfile",
                    "experimental": true,
                    "description": "Collect type profile."
                }
            ],
            "types": [
                {
                    "properties": [
                        {
                            "type": "integer",
                            "name": "id",
                            "description": "Unique id of the node."
                        },
                        {
                            "$ref": "Runtime.CallFrame",
                            "name": "callFrame",
                            "description": "Function location."
                        },
                        {
                            "type": "integer",
                            "optional": true,
                            "name": "hitCount",
                            "description": "Number of samples where this node was on top of the call stack."
                        },
                        {
                            "type": "array",
                            "items": {
                                "type": "integer"
                            },
                            "optional": true,
                            "name": "children",
                            "description": "Child node ids."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "deoptReason",
                            "description": "The reason of being not optimized. The function may be deoptimized or marked as don't\noptimize."
                        },
                        {
                            "type": "array",
                            "items": {
                                "$ref": "PositionTickInfo"
                            },
                            "optional": true,
                            "name": "positionTicks",
                            "description": "An array of source position ticks."
                        }
                    ],
                    "type": "object",
                    "id": "ProfileNode",
                    "description": "Profile node. Holds callsite information, execution statistics and child nodes."
                },
                {
                    "properties": [
                        {
                            "items": {
                                "$ref": "ProfileNode"
                            },
                            "type": "array",
                            "name": "nodes",
                            "description": "The list of profile nodes. First item is the root node."
                        },
                        {
                            "type": "number",
                            "name": "startTime",
                            "description": "Profiling start timestamp in microseconds."
                        },
                        {
                            "type": "number",
                            "name": "endTime",
                            "description": "Profiling end timestamp in microseconds."
                        },
                        {
                            "type": "array",
                            "items": {
                                "type": "integer"
                            },
                            "optional": true,
                            "name": "samples",
                            "description": "Ids of samples top nodes."
                        },
                        {
                            "type": "array",
                            "items": {
                                "type": "integer"
                            },
                            "optional": true,
                            "name": "timeDeltas",
                            "description": "Time intervals between adjacent samples in microseconds. The first delta is relative to the\nprofile startTime."
                        }
                    ],
                    "type": "object",
                    "id": "Profile",
                    "description": "Profile."
                },
                {
                    "properties": [
                        {
                            "type": "integer",
                            "name": "line",
                            "description": "Source line number (1-based)."
                        },
                        {
                            "type": "integer",
                            "name": "ticks",
                            "description": "Number of samples attributed to the source line."
                        }
                    ],
                    "type": "object",
                    "id": "PositionTickInfo",
                    "description": "Specifies a number of samples attributed to a certain source position."
                },
                {
                    "properties": [
                        {
                            "type": "integer",
                            "name": "startOffset",
                            "description": "JavaScript script source offset for the range start."
                        },
                        {
                            "type": "integer",
                            "name": "endOffset",
                            "description": "JavaScript script source offset for the range end."
                        },
                        {
                            "type": "integer",
                            "name": "count",
                            "description": "Collected execution count of the source range."
                        }
                    ],
                    "type": "object",
                    "id": "CoverageRange",
                    "description": "Coverage data for a source range."
                },
                {
                    "properties": [
                        {
                            "type": "string",
                            "name": "functionName",
                            "description": "JavaScript function name."
                        },
                        {
                            "items": {
                                "$ref": "CoverageRange"
                            },
                            "type": "array",
                            "name": "ranges",
                            "description": "Source ranges inside the function with coverage data."
                        },
                        {
                            "type": "boolean",
                            "name": "isBlockCoverage",
                            "description": "Whether coverage data for this function has block granularity."
                        }
                    ],
                    "type": "object",
                    "id": "FunctionCoverage",
                    "description": "Coverage data for a JavaScript function."
                },
                {
                    "properties": [
                        {
                            "$ref": "Runtime.ScriptId",
                            "name": "scriptId",
                            "description": "JavaScript script id."
                        },
                        {
                            "type": "string",
                            "name": "url",
                            "description": "JavaScript script name or url."
                        },
                        {
                            "items": {
                                "$ref": "FunctionCoverage"
                            },
                            "type": "array",
                            "name": "functions",
                            "description": "Functions contained in the script that has coverage data."
                        }
                    ],
                    "type": "object",
                    "id": "ScriptCoverage",
                    "description": "Coverage data for a JavaScript script."
                },
                {
                    "properties": [
                        {
                            "type": "string",
                            "name": "name",
                            "description": "Name of a type collected with type profiling."
                        }
                    ],
                    "type": "object",
                    "id": "TypeObject",
                    "experimental": true,
                    "description": "Describes a type collected during runtime."
                },
                {
                    "properties": [
                        {
                            "type": "integer",
                            "name": "offset",
                            "description": "Source offset of the parameter or end of function for return values."
                        },
                        {
                            "items": {
                                "$ref": "TypeObject"
                            },
                            "type": "array",
                            "name": "types",
                            "description": "The types for this parameter or return value."
                        }
                    ],
                    "type": "object",
                    "id": "TypeProfileEntry",
                    "experimental": true,
                    "description": "Source offset and types for a parameter or return value."
                },
                {
                    "properties": [
                        {
                            "$ref": "Runtime.ScriptId",
                            "name": "scriptId",
                            "description": "JavaScript script id."
                        },
                        {
                            "type": "string",
                            "name": "url",
                            "description": "JavaScript script name or url."
                        },
                        {
                            "items": {
                                "$ref": "TypeProfileEntry"
                            },
                            "type": "array",
                            "name": "entries",
                            "description": "Type profile entries for parameters and return values of the functions in the script."
                        }
                    ],
                    "type": "object",
                    "id": "ScriptTypeProfile",
                    "experimental": true,
                    "description": "Type profile data collected during runtime for a JavaScript script."
                }
            ],
            "events": [
                {
                    "name": "consoleProfileFinished",
                    "parameters": [
                        {
                            "type": "string",
                            "name": "id"
                        },
                        {
                            "$ref": "Debugger.Location",
                            "name": "location",
                            "description": "Location of console.profileEnd()."
                        },
                        {
                            "name": "profile",
                            "$ref": "Profile"
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "title",
                            "description": "Profile title passed as an argument to console.profile()."
                        }
                    ]
                },
                {
                    "name": "consoleProfileStarted",
                    "parameters": [
                        {
                            "type": "string",
                            "name": "id"
                        },
                        {
                            "$ref": "Debugger.Location",
                            "name": "location",
                            "description": "Location of console.profile()."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "title",
                            "description": "Profile title passed as an argument to console.profile()."
                        }
                    ],
                    "description": "Sent when new profile recording is started using console.profile() call."
                }
            ]
        },
        {
            "commands": [
                {
                    "returns": [
                        {
                            "$ref": "RemoteObject",
                            "name": "result",
                            "description": "Promise result. Will contain rejected value if promise was rejected."
                        },
                        {
                            "$ref": "ExceptionDetails",
                            "optional": true,
                            "name": "exceptionDetails",
                            "description": "Exception details if stack strace is available."
                        }
                    ],
                    "name": "awaitPromise",
                    "parameters": [
                        {
                            "$ref": "RemoteObjectId",
                            "name": "promiseObjectId",
                            "description": "Identifier of the promise."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "returnByValue",
                            "description": "Whether the result is expected to be a JSON object that should be sent by value."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "generatePreview",
                            "description": "Whether preview should be generated for the result."
                        }
                    ],
                    "description": "Add handler to promise with given promise object id."
                },
                {
                    "returns": [
                        {
                            "$ref": "RemoteObject",
                            "name": "result",
                            "description": "Call result."
                        },
                        {
                            "$ref": "ExceptionDetails",
                            "optional": true,
                            "name": "exceptionDetails",
                            "description": "Exception details."
                        }
                    ],
                    "name": "callFunctionOn",
                    "parameters": [
                        {
                            "type": "string",
                            "name": "functionDeclaration",
                            "description": "Declaration of the function to call."
                        },
                        {
                            "$ref": "RemoteObjectId",
                            "optional": true,
                            "name": "objectId",
                            "description": "Identifier of the object to call function on. Either objectId or executionContextId should\nbe specified."
                        },
                        {
                            "type": "array",
                            "items": {
                                "$ref": "CallArgument"
                            },
                            "optional": true,
                            "name": "arguments",
                            "description": "Call arguments. All call arguments must belong to the same JavaScript world as the target\nobject."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "silent",
                            "description": "In silent mode exceptions thrown during evaluation are not reported and do not pause\nexecution. Overrides `setPauseOnException` state."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "returnByValue",
                            "description": "Whether the result is expected to be a JSON object which should be sent by value."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "generatePreview",
                            "experimental": true,
                            "description": "Whether preview should be generated for the result."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "userGesture",
                            "description": "Whether execution should be treated as initiated by user in the UI."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "awaitPromise",
                            "description": "Whether execution should `await` for resulting value and return once awaited promise is\nresolved."
                        },
                        {
                            "$ref": "ExecutionContextId",
                            "optional": true,
                            "name": "executionContextId",
                            "description": "Specifies execution context which global object will be used to call function on. Either\nexecutionContextId or objectId should be specified."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "objectGroup",
                            "description": "Symbolic group name that can be used to release multiple objects. If objectGroup is not\nspecified and objectId is, objectGroup will be inherited from object."
                        }
                    ],
                    "description": "Calls function with given declaration on the given object. Object group of the result is\ninherited from the target object."
                },
                {
                    "returns": [
                        {
                            "$ref": "ScriptId",
                            "optional": true,
                            "name": "scriptId",
                            "description": "Id of the script."
                        },
                        {
                            "$ref": "ExceptionDetails",
                            "optional": true,
                            "name": "exceptionDetails",
                            "description": "Exception details."
                        }
                    ],
                    "name": "compileScript",
                    "parameters": [
                        {
                            "type": "string",
                            "name": "expression",
                            "description": "Expression to compile."
                        },
                        {
                            "type": "string",
                            "name": "sourceURL",
                            "description": "Source url to be set for the script."
                        },
                        {
                            "type": "boolean",
                            "name": "persistScript",
                            "description": "Specifies whether the compiled script should be persisted."
                        },
                        {
                            "$ref": "ExecutionContextId",
                            "optional": true,
                            "name": "executionContextId",
                            "description": "Specifies in which execution context to perform script run. If the parameter is omitted the\nevaluation will be performed in the context of the inspected page."
                        }
                    ],
                    "description": "Compiles expression."
                },
                {
                    "name": "disable",
                    "description": "Disables reporting of execution contexts creation."
                },
                {
                    "name": "discardConsoleEntries",
                    "description": "Discards collected exceptions and console API calls."
                },
                {
                    "name": "enable",
                    "description": "Enables reporting of execution contexts creation by means of `executionContextCreated` event.\nWhen the reporting gets enabled the event will be sent immediately for each existing execution\ncontext."
                },
                {
                    "returns": [
                        {
                            "$ref": "RemoteObject",
                            "name": "result",
                            "description": "Evaluation result."
                        },
                        {
                            "$ref": "ExceptionDetails",
                            "optional": true,
                            "name": "exceptionDetails",
                            "description": "Exception details."
                        }
                    ],
                    "name": "evaluate",
                    "parameters": [
                        {
                            "type": "string",
                            "name": "expression",
                            "description": "Expression to evaluate."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "objectGroup",
                            "description": "Symbolic group name that can be used to release multiple objects."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "includeCommandLineAPI",
                            "description": "Determines whether Command Line API should be available during the evaluation."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "silent",
                            "description": "In silent mode exceptions thrown during evaluation are not reported and do not pause\nexecution. Overrides `setPauseOnException` state."
                        },
                        {
                            "$ref": "ExecutionContextId",
                            "optional": true,
                            "name": "contextId",
                            "description": "Specifies in which execution context to perform evaluation. If the parameter is omitted the\nevaluation will be performed in the context of the inspected page."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "returnByValue",
                            "description": "Whether the result is expected to be a JSON object that should be sent by value."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "generatePreview",
                            "experimental": true,
                            "description": "Whether preview should be generated for the result."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "userGesture",
                            "description": "Whether execution should be treated as initiated by user in the UI."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "awaitPromise",
                            "description": "Whether execution should `await` for resulting value and return once awaited promise is\nresolved."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "throwOnSideEffect",
                            "experimental": true,
                            "description": "Whether to throw an exception if side effect cannot be ruled out during evaluation."
                        },
                        {
                            "$ref": "TimeDelta",
                            "optional": true,
                            "name": "timeout",
                            "experimental": true,
                            "description": "Terminate execution after timing out (number of milliseconds)."
                        }
                    ],
                    "description": "Evaluates expression on global object."
                },
                {
                    "returns": [
                        {
                            "type": "string",
                            "name": "id",
                            "description": "The isolate id."
                        }
                    ],
                    "name": "getIsolateId",
                    "experimental": true,
                    "description": "Returns the isolate id."
                },
                {
                    "returns": [
                        {
                            "type": "number",
                            "name": "usedSize",
                            "description": "Used heap size in bytes."
                        },
                        {
                            "type": "number",
                            "name": "totalSize",
                            "description": "Allocated heap size in bytes."
                        }
                    ],
                    "name": "getHeapUsage",
                    "experimental": true,
                    "description": "Returns the JavaScript heap usage.\nIt is the total usage of the corresponding isolate not scoped to a particular Runtime."
                },
                {
                    "returns": [
                        {
                            "items": {
                                "$ref": "PropertyDescriptor"
                            },
                            "type": "array",
                            "name": "result",
                            "description": "Object properties."
                        },
                        {
                            "type": "array",
                            "items": {
                                "$ref": "InternalPropertyDescriptor"
                            },
                            "optional": true,
                            "name": "internalProperties",
                            "description": "Internal object properties (only of the element itself)."
                        },
                        {
                            "$ref": "ExceptionDetails",
                            "optional": true,
                            "name": "exceptionDetails",
                            "description": "Exception details."
                        }
                    ],
                    "name": "getProperties",
                    "parameters": [
                        {
                            "$ref": "RemoteObjectId",
                            "name": "objectId",
                            "description": "Identifier of the object to return properties for."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "ownProperties",
                            "description": "If true, returns properties belonging only to the element itself, not to its prototype\nchain."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "accessorPropertiesOnly",
                            "experimental": true,
                            "description": "If true, returns accessor properties (with getter/setter) only; internal properties are not\nreturned either."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "generatePreview",
                            "experimental": true,
                            "description": "Whether preview should be generated for the results."
                        }
                    ],
                    "description": "Returns properties of a given object. Object group of the result is inherited from the target\nobject."
                },
                {
                    "returns": [
                        {
                            "items": {
                                "type": "string"
                            },
                            "type": "array",
                            "name": "names"
                        }
                    ],
                    "name": "globalLexicalScopeNames",
                    "parameters": [
                        {
                            "$ref": "ExecutionContextId",
                            "optional": true,
                            "name": "executionContextId",
                            "description": "Specifies in which execution context to lookup global scope variables."
                        }
                    ],
                    "description": "Returns all let, const and class variables from global scope."
                },
                {
                    "returns": [
                        {
                            "$ref": "RemoteObject",
                            "name": "objects",
                            "description": "Array with objects."
                        }
                    ],
                    "name": "queryObjects",
                    "parameters": [
                        {
                            "$ref": "RemoteObjectId",
                            "name": "prototypeObjectId",
                            "description": "Identifier of the prototype to return objects for."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "objectGroup",
                            "description": "Symbolic group name that can be used to release the results."
                        }
                    ]
                },
                {
                    "name": "releaseObject",
                    "parameters": [
                        {
                            "$ref": "RemoteObjectId",
                            "name": "objectId",
                            "description": "Identifier of the object to release."
                        }
                    ],
                    "description": "Releases remote object with given id."
                },
                {
                    "name": "releaseObjectGroup",
                    "parameters": [
                        {
                            "type": "string",
                            "name": "objectGroup",
                            "description": "Symbolic object group name."
                        }
                    ],
                    "description": "Releases all remote objects that belong to a given group."
                },
                {
                    "name": "runIfWaitingForDebugger",
                    "description": "Tells inspected instance to run if it was waiting for debugger to attach."
                },
                {
                    "returns": [
                        {
                            "$ref": "RemoteObject",
                            "name": "result",
                            "description": "Run result."
                        },
                        {
                            "$ref": "ExceptionDetails",
                            "optional": true,
                            "name": "exceptionDetails",
                            "description": "Exception details."
                        }
                    ],
                    "name": "runScript",
                    "parameters": [
                        {
                            "$ref": "ScriptId",
                            "name": "scriptId",
                            "description": "Id of the script to run."
                        },
                        {
                            "$ref": "ExecutionContextId",
                            "optional": true,
                            "name": "executionContextId",
                            "description": "Specifies in which execution context to perform script run. If the parameter is omitted the\nevaluation will be performed in the context of the inspected page."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "objectGroup",
                            "description": "Symbolic group name that can be used to release multiple objects."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "silent",
                            "description": "In silent mode exceptions thrown during evaluation are not reported and do not pause\nexecution. Overrides `setPauseOnException` state."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "includeCommandLineAPI",
                            "description": "Determines whether Command Line API should be available during the evaluation."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "returnByValue",
                            "description": "Whether the result is expected to be a JSON object which should be sent by value."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "generatePreview",
                            "description": "Whether preview should be generated for the result."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "awaitPromise",
                            "description": "Whether execution should `await` for resulting value and return once awaited promise is\nresolved."
                        }
                    ],
                    "description": "Runs script with given id in a given context."
                },
                {
                    "redirect": "Debugger",
                    "name": "setAsyncCallStackDepth",
                    "parameters": [
                        {
                            "type": "integer",
                            "name": "maxDepth",
                            "description": "Maximum depth of async call stacks. Setting to `0` will effectively disable collecting async\ncall stacks (default)."
                        }
                    ],
                    "description": "Enables or disables async call stacks tracking."
                },
                {
                    "parameters": [
                        {
                            "type": "boolean",
                            "name": "enabled"
                        }
                    ],
                    "name": "setCustomObjectFormatterEnabled",
                    "experimental": true
                },
                {
                    "parameters": [
                        {
                            "type": "integer",
                            "name": "size"
                        }
                    ],
                    "name": "setMaxCallStackSizeToCapture",
                    "experimental": true
                },
                {
                    "name": "terminateExecution",
                    "experimental": true,
                    "description": "Terminate current or next JavaScript execution.\nWill cancel the termination when the outer-most script execution ends."
                },
                {
                    "parameters": [
                        {
                            "type": "string",
                            "name": "name"
                        },
                        {
                            "optional": true,
                            "name": "executionContextId",
                            "$ref": "ExecutionContextId"
                        }
                    ],
                    "name": "addBinding",
                    "experimental": true,
                    "description": "If executionContextId is empty, adds binding with the given name on the\nglobal objects of all inspected contexts, including those created later,\nbindings survive reloads.\nIf executionContextId is specified, adds binding only on global object of\ngiven execution context.\nBinding function takes exactly one argument, this argument should be string,\nin case of any other input, function throws an exception.\nEach binding function call produces Runtime.bindingCalled notification."
                },
                {
                    "parameters": [
                        {
                            "type": "string",
                            "name": "name"
                        }
                    ],
                    "name": "removeBinding",
                    "experimental": true,
                    "description": "This method does not remove binding function from global object but\nunsubscribes current runtime agent from Runtime.bindingCalled notifications."
                }
            ],
            "domain": "Runtime",
            "description": "Runtime domain exposes JavaScript runtime by means of remote evaluation and mirror objects.\nEvaluation results are returned as mirror object that expose object type, string representation\nand unique identifier that can be used for further object reference. Original objects are\nmaintained in memory unless they are either explicitly released or are released along with the\nother objects in their object group.",
            "types": [
                {
                    "type": "string",
                    "id": "ScriptId",
                    "description": "Unique script identifier."
                },
                {
                    "type": "string",
                    "id": "RemoteObjectId",
                    "description": "Unique object identifier."
                },
                {
                    "type": "string",
                    "id": "UnserializableValue",
                    "description": "Primitive value which cannot be JSON-stringified. Includes values `-0`, `NaN`, `Infinity`,\n`-Infinity`, and bigint literals."
                },
                {
                    "properties": [
                        {
                            "enum": [
                                "object",
                                "function",
                                "undefined",
                                "string",
                                "number",
                                "boolean",
                                "symbol",
                                "bigint"
                            ],
                            "type": "string",
                            "name": "type",
                            "description": "Object type."
                        },
                        {
                            "type": "string",
                            "enum": [
                                "array",
                                "null",
                                "node",
                                "regexp",
                                "date",
                                "map",
                                "set",
                                "weakmap",
                                "weakset",
                                "iterator",
                                "generator",
                                "error",
                                "proxy",
                                "promise",
                                "typedarray",
                                "arraybuffer",
                                "dataview"
                            ],
                            "optional": true,
                            "name": "subtype",
                            "description": "Object subtype hint. Specified for `object` type values only."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "className",
                            "description": "Object class (constructor) name. Specified for `object` type values only."
                        },
                        {
                            "type": "any",
                            "optional": true,
                            "name": "value",
                            "description": "Remote object value in case of primitive values or JSON values (if it was requested)."
                        },
                        {
                            "$ref": "UnserializableValue",
                            "optional": true,
                            "name": "unserializableValue",
                            "description": "Primitive value which can not be JSON-stringified does not have `value`, but gets this\nproperty."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "description",
                            "description": "String representation of the object."
                        },
                        {
                            "$ref": "RemoteObjectId",
                            "optional": true,
                            "name": "objectId",
                            "description": "Unique object identifier (for non-primitive values)."
                        },
                        {
                            "$ref": "ObjectPreview",
                            "optional": true,
                            "name": "preview",
                            "experimental": true,
                            "description": "Preview containing abbreviated property values. Specified for `object` type values only."
                        },
                        {
                            "optional": true,
                            "name": "customPreview",
                            "experimental": true,
                            "$ref": "CustomPreview"
                        }
                    ],
                    "type": "object",
                    "id": "RemoteObject",
                    "description": "Mirror object referencing original JavaScript object."
                },
                {
                    "type": "object",
                    "id": "CustomPreview",
                    "experimental": true,
                    "properties": [
                        {
                            "type": "string",
                            "name": "header",
                            "description": "The JSON-stringified result of formatter.header(object, config) call.\nIt contains json ML array that represents RemoteObject."
                        },
                        {
                            "$ref": "RemoteObjectId",
                            "optional": true,
                            "name": "bodyGetterId",
                            "description": "If formatter returns true as a result of formatter.hasBody call then bodyGetterId will\ncontain RemoteObjectId for the function that returns result of formatter.body(object, config) call.\nThe result value is json ML array."
                        }
                    ]
                },
                {
                    "properties": [
                        {
                            "enum": [
                                "object",
                                "function",
                                "undefined",
                                "string",
                                "number",
                                "boolean",
                                "symbol",
                                "bigint"
                            ],
                            "type": "string",
                            "name": "type",
                            "description": "Object type."
                        },
                        {
                            "type": "string",
                            "enum": [
                                "array",
                                "null",
                                "node",
                                "regexp",
                                "date",
                                "map",
                                "set",
                                "weakmap",
                                "weakset",
                                "iterator",
                                "generator",
                                "error"
                            ],
                            "optional": true,
                            "name": "subtype",
                            "description": "Object subtype hint. Specified for `object` type values only."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "description",
                            "description": "String representation of the object."
                        },
                        {
                            "type": "boolean",
                            "name": "overflow",
                            "description": "True iff some of the properties or entries of the original object did not fit."
                        },
                        {
                            "items": {
                                "$ref": "PropertyPreview"
                            },
                            "type": "array",
                            "name": "properties",
                            "description": "List of the properties."
                        },
                        {
                            "type": "array",
                            "items": {
                                "$ref": "EntryPreview"
                            },
                            "optional": true,
                            "name": "entries",
                            "description": "List of the entries. Specified for `map` and `set` subtype values only."
                        }
                    ],
                    "type": "object",
                    "id": "ObjectPreview",
                    "experimental": true,
                    "description": "Object containing abbreviated remote object value."
                },
                {
                    "type": "object",
                    "id": "PropertyPreview",
                    "experimental": true,
                    "properties": [
                        {
                            "type": "string",
                            "name": "name",
                            "description": "Property name."
                        },
                        {
                            "enum": [
                                "object",
                                "function",
                                "undefined",
                                "string",
                                "number",
                                "boolean",
                                "symbol",
                                "accessor",
                                "bigint"
                            ],
                            "type": "string",
                            "name": "type",
                            "description": "Object type. Accessor means that the property itself is an accessor property."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "value",
                            "description": "User-friendly property value string."
                        },
                        {
                            "$ref": "ObjectPreview",
                            "optional": true,
                            "name": "valuePreview",
                            "description": "Nested value preview."
                        },
                        {
                            "type": "string",
                            "enum": [
                                "array",
                                "null",
                                "node",
                                "regexp",
                                "date",
                                "map",
                                "set",
                                "weakmap",
                                "weakset",
                                "iterator",
                                "generator",
                                "error"
                            ],
                            "optional": true,
                            "name": "subtype",
                            "description": "Object subtype hint. Specified for `object` type values only."
                        }
                    ]
                },
                {
                    "type": "object",
                    "id": "EntryPreview",
                    "experimental": true,
                    "properties": [
                        {
                            "$ref": "ObjectPreview",
                            "optional": true,
                            "name": "key",
                            "description": "Preview of the key. Specified for map-like collection entries."
                        },
                        {
                            "$ref": "ObjectPreview",
                            "name": "value",
                            "description": "Preview of the value."
                        }
                    ]
                },
                {
                    "properties": [
                        {
                            "type": "string",
                            "name": "name",
                            "description": "Property name or symbol description."
                        },
                        {
                            "$ref": "RemoteObject",
                            "optional": true,
                            "name": "value",
                            "description": "The value associated with the property."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "writable",
                            "description": "True if the value associated with the property may be changed (data descriptors only)."
                        },
                        {
                            "$ref": "RemoteObject",
                            "optional": true,
                            "name": "get",
                            "description": "A function which serves as a getter for the property, or `undefined` if there is no getter\n(accessor descriptors only)."
                        },
                        {
                            "$ref": "RemoteObject",
                            "optional": true,
                            "name": "set",
                            "description": "A function which serves as a setter for the property, or `undefined` if there is no setter\n(accessor descriptors only)."
                        },
                        {
                            "type": "boolean",
                            "name": "configurable",
                            "description": "True if the type of this property descriptor may be changed and if the property may be\ndeleted from the corresponding object."
                        },
                        {
                            "type": "boolean",
                            "name": "enumerable",
                            "description": "True if this property shows up during enumeration of the properties on the corresponding\nobject."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "wasThrown",
                            "description": "True if the result was thrown during the evaluation."
                        },
                        {
                            "type": "boolean",
                            "optional": true,
                            "name": "isOwn",
                            "description": "True if the property is owned for the object."
                        },
                        {
                            "$ref": "RemoteObject",
                            "optional": true,
                            "name": "symbol",
                            "description": "Property symbol object, if the property is of the `symbol` type."
                        }
                    ],
                    "type": "object",
                    "id": "PropertyDescriptor",
                    "description": "Object property descriptor."
                },
                {
                    "properties": [
                        {
                            "type": "string",
                            "name": "name",
                            "description": "Conventional property name."
                        },
                        {
                            "$ref": "RemoteObject",
                            "optional": true,
                            "name": "value",
                            "description": "The value associated with the property."
                        }
                    ],
                    "type": "object",
                    "id": "InternalPropertyDescriptor",
                    "description": "Object internal property descriptor. This property isn't normally visible in JavaScript code."
                },
                {
                    "properties": [
                        {
                            "type": "any",
                            "optional": true,
                            "name": "value",
                            "description": "Primitive value or serializable javascript object."
                        },
                        {
                            "$ref": "UnserializableValue",
                            "optional": true,
                            "name": "unserializableValue",
                            "description": "Primitive value which can not be JSON-stringified."
                        },
                        {
                            "$ref": "RemoteObjectId",
                            "optional": true,
                            "name": "objectId",
                            "description": "Remote object handle."
                        }
                    ],
                    "type": "object",
                    "id": "CallArgument",
                    "description": "Represents function call argument. Either remote object id `objectId`, primitive `value`,\nunserializable primitive value or neither of (for undefined) them should be specified."
                },
                {
                    "type": "integer",
                    "id": "ExecutionContextId",
                    "description": "Id of an execution context."
                },
                {
                    "properties": [
                        {
                            "$ref": "ExecutionContextId",
                            "name": "id",
                            "description": "Unique id of the execution context. It can be used to specify in which execution context\nscript evaluation should be performed."
                        },
                        {
                            "type": "string",
                            "name": "origin",
                            "description": "Execution context origin."
                        },
                        {
                            "type": "string",
                            "name": "name",
                            "description": "Human readable name describing given context."
                        },
                        {
                            "type": "object",
                            "optional": true,
                            "name": "auxData",
                            "description": "Embedder-specific auxiliary data."
                        }
                    ],
                    "type": "object",
                    "id": "ExecutionContextDescription",
                    "description": "Description of an isolated world."
                },
                {
                    "properties": [
                        {
                            "type": "integer",
                            "name": "exceptionId",
                            "description": "Exception id."
                        },
                        {
                            "type": "string",
                            "name": "text",
                            "description": "Exception text, which should be used together with exception object when available."
                        },
                        {
                            "type": "integer",
                            "name": "lineNumber",
                            "description": "Line number of the exception location (0-based)."
                        },
                        {
                            "type": "integer",
                            "name": "columnNumber",
                            "description": "Column number of the exception location (0-based)."
                        },
                        {
                            "$ref": "ScriptId",
                            "optional": true,
                            "name": "scriptId",
                            "description": "Script ID of the exception location."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "url",
                            "description": "URL of the exception location, to be used when the script was not reported."
                        },
                        {
                            "$ref": "StackTrace",
                            "optional": true,
                            "name": "stackTrace",
                            "description": "JavaScript stack trace if available."
                        },
                        {
                            "$ref": "RemoteObject",
                            "optional": true,
                            "name": "exception",
                            "description": "Exception object if available."
                        },
                        {
                            "$ref": "ExecutionContextId",
                            "optional": true,
                            "name": "executionContextId",
                            "description": "Identifier of the context where exception happened."
                        }
                    ],
                    "type": "object",
                    "id": "ExceptionDetails",
                    "description": "Detailed information about exception (or error) that was thrown during script compilation or\nexecution."
                },
                {
                    "type": "number",
                    "id": "Timestamp",
                    "description": "Number of milliseconds since epoch."
                },
                {
                    "type": "number",
                    "id": "TimeDelta",
                    "description": "Number of milliseconds."
                },
                {
                    "properties": [
                        {
                            "type": "string",
                            "name": "functionName",
                            "description": "JavaScript function name."
                        },
                        {
                            "$ref": "ScriptId",
                            "name": "scriptId",
                            "description": "JavaScript script id."
                        },
                        {
                            "type": "string",
                            "name": "url",
                            "description": "JavaScript script name or url."
                        },
                        {
                            "type": "integer",
                            "name": "lineNumber",
                            "description": "JavaScript script line number (0-based)."
                        },
                        {
                            "type": "integer",
                            "name": "columnNumber",
                            "description": "JavaScript script column number (0-based)."
                        }
                    ],
                    "type": "object",
                    "id": "CallFrame",
                    "description": "Stack entry for runtime errors and assertions."
                },
                {
                    "properties": [
                        {
                            "type": "string",
                            "optional": true,
                            "name": "description",
                            "description": "String label of this stack trace. For async traces this may be a name of the function that\ninitiated the async call."
                        },
                        {
                            "items": {
                                "$ref": "CallFrame"
                            },
                            "type": "array",
                            "name": "callFrames",
                            "description": "JavaScript function name."
                        },
                        {
                            "$ref": "StackTrace",
                            "optional": true,
                            "name": "parent",
                            "description": "Asynchronous JavaScript stack trace that preceded this stack, if available."
                        },
                        {
                            "$ref": "StackTraceId",
                            "optional": true,
                            "name": "parentId",
                            "experimental": true,
                            "description": "Asynchronous JavaScript stack trace that preceded this stack, if available."
                        }
                    ],
                    "type": "object",
                    "id": "StackTrace",
                    "description": "Call frames for assertions or error messages."
                },
                {
                    "type": "string",
                    "id": "UniqueDebuggerId",
                    "experimental": true,
                    "description": "Unique identifier of current debugger."
                },
                {
                    "properties": [
                        {
                            "type": "string",
                            "name": "id"
                        },
                        {
                            "optional": true,
                            "name": "debuggerId",
                            "$ref": "UniqueDebuggerId"
                        }
                    ],
                    "type": "object",
                    "id": "StackTraceId",
                    "experimental": true,
                    "description": "If `debuggerId` is set stack trace comes from another debugger and can be resolved there. This\nallows to track cross-debugger calls. See `Runtime.StackTrace` and `Debugger.paused` for usages."
                }
            ],
            "events": [
                {
                    "parameters": [
                        {
                            "type": "string",
                            "name": "name"
                        },
                        {
                            "type": "string",
                            "name": "payload"
                        },
                        {
                            "$ref": "ExecutionContextId",
                            "name": "executionContextId",
                            "description": "Identifier of the context where the call was made."
                        }
                    ],
                    "name": "bindingCalled",
                    "experimental": true,
                    "description": "Notification is issued every time when binding is called."
                },
                {
                    "name": "consoleAPICalled",
                    "parameters": [
                        {
                            "enum": [
                                "log",
                                "debug",
                                "info",
                                "error",
                                "warning",
                                "dir",
                                "dirxml",
                                "table",
                                "trace",
                                "clear",
                                "startGroup",
                                "startGroupCollapsed",
                                "endGroup",
                                "assert",
                                "profile",
                                "profileEnd",
                                "count",
                                "timeEnd"
                            ],
                            "type": "string",
                            "name": "type",
                            "description": "Type of the call."
                        },
                        {
                            "items": {
                                "$ref": "RemoteObject"
                            },
                            "type": "array",
                            "name": "args",
                            "description": "Call arguments."
                        },
                        {
                            "$ref": "ExecutionContextId",
                            "name": "executionContextId",
                            "description": "Identifier of the context where the call was made."
                        },
                        {
                            "$ref": "Timestamp",
                            "name": "timestamp",
                            "description": "Call timestamp."
                        },
                        {
                            "$ref": "StackTrace",
                            "optional": true,
                            "name": "stackTrace",
                            "description": "Stack trace captured when the call was made."
                        },
                        {
                            "type": "string",
                            "optional": true,
                            "name": "context",
                            "experimental": true,
                            "description": "Console context descriptor for calls on non-default console context (not console.*):\n'anonymous#unique-logger-id' for call on unnamed context, 'name#unique-logger-id' for call\non named context."
                        }
                    ],
                    "description": "Issued when console API was called."
                },
                {
                    "name": "exceptionRevoked",
                    "parameters": [
                        {
                            "type": "string",
                            "name": "reason",
                            "description": "Reason describing why exception was revoked."
                        },
                        {
                            "type": "integer",
                            "name": "exceptionId",
                            "description": "The id of revoked exception, as reported in `exceptionThrown`."
                        }
                    ],
                    "description": "Issued when unhandled exception was revoked."
                },
                {
                    "name": "exceptionThrown",
                    "parameters": [
                        {
                            "$ref": "Timestamp",
                            "name": "timestamp",
                            "description": "Timestamp of the exception."
                        },
                        {
                            "name": "exceptionDetails",
                            "$ref": "ExceptionDetails"
                        }
                    ],
                    "description": "Issued when exception was thrown and unhandled."
                },
                {
                    "name": "executionContextCreated",
                    "parameters": [
                        {
                            "$ref": "ExecutionContextDescription",
                            "name": "context",
                            "description": "A newly created execution context."
                        }
                    ],
                    "description": "Issued when new execution context is created."
                },
                {
                    "name": "executionContextDestroyed",
                    "parameters": [
                        {
                            "$ref": "ExecutionContextId",
                            "name": "executionContextId",
                            "description": "Id of the destroyed context"
                        }
                    ],
                    "description": "Issued when execution context is destroyed."
                },
                {
                    "name": "executionContextsCleared",
                    "description": "Issued when all executionContexts were cleared in browser"
                },
                {
                    "name": "inspectRequested",
                    "parameters": [
                        {
                            "name": "object",
                            "$ref": "RemoteObject"
                        },
                        {
                            "type": "object",
                            "name": "hints"
                        }
                    ],
                    "description": "Issued when object should be inspected (for example, as a result of inspect() command line API\ncall)."
                }
            ]
        },
        {
            "deprecated": true,
            "domain": "Schema",
            "commands": [
                {
                    "returns": [
                        {
                            "items": {
                                "$ref": "Domain"
                            },
                            "type": "array",
                            "name": "domains",
                            "description": "List of supported domains."
                        }
                    ],
                    "name": "getDomains",
                    "description": "Returns supported domains."
                }
            ],
            "description": "This domain is deprecated.",
            "types": [
                {
                    "properties": [
                        {
                            "type": "string",
                            "name": "name",
                            "description": "Domain name."
                        },
                        {
                            "type": "string",
                            "name": "version",
                            "description": "Domain version."
                        }
                    ],
                    "type": "object",
                    "id": "Domain",
                    "description": "Description of the protocol domain."
                }
            ]
        }
    ],
    "version": {
        "major": "1",
        "minor": "3"
    }
};

export const Protocol = { Description };
