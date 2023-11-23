"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SummaryStatsReportGatherer = void 0;
/*
Copyright 2023 The Matrix.org Foundation C.I.C.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

class SummaryStatsReportGatherer {
  constructor(emitter) {
    this.emitter = emitter;
  }
  build(allSummary) {
    // Filter all stats which collect the first time webrtc stats.
    // Because stats based on time interval and the first collection of a summery stats has no previous
    // webrtcStats as basement all the calculation are 0. We don't want track the 0 stats.
    const summary = allSummary.filter(s => !s.isFirstCollection);
    const summaryTotalCount = summary.length;
    if (summaryTotalCount === 0) {
      return;
    }
    const summaryCounter = {
      receivedAudio: 0,
      receivedVideo: 0,
      receivedMedia: 0,
      concealedAudio: 0,
      totalAudio: 0
    };
    let maxJitter = 0;
    let maxPacketLoss = 0;
    summary.forEach(stats => {
      this.countTrackListReceivedMedia(summaryCounter, stats);
      this.countConcealedAudio(summaryCounter, stats);
      maxJitter = this.buildMaxJitter(maxJitter, stats);
      maxPacketLoss = this.buildMaxPacketLoss(maxPacketLoss, stats);
    });
    const decimalPlaces = 5;
    const report = {
      percentageReceivedMedia: Number((summaryCounter.receivedMedia / summaryTotalCount).toFixed(decimalPlaces)),
      percentageReceivedVideoMedia: Number((summaryCounter.receivedVideo / summaryTotalCount).toFixed(decimalPlaces)),
      percentageReceivedAudioMedia: Number((summaryCounter.receivedAudio / summaryTotalCount).toFixed(decimalPlaces)),
      maxJitter,
      maxPacketLoss,
      percentageConcealedAudio: Number(summaryCounter.totalAudio > 0 ? (summaryCounter.concealedAudio / summaryCounter.totalAudio).toFixed(decimalPlaces) : 0),
      peerConnections: summaryTotalCount
    };
    this.emitter.emitSummaryStatsReport(report);
  }
  countTrackListReceivedMedia(counter, stats) {
    let hasReceivedAudio = false;
    let hasReceivedVideo = false;
    if (stats.receivedAudioMedia > 0 || stats.audioTrackSummary.count === 0) {
      counter.receivedAudio++;
      hasReceivedAudio = true;
    }
    if (stats.receivedVideoMedia > 0 || stats.videoTrackSummary.count === 0) {
      counter.receivedVideo++;
      hasReceivedVideo = true;
    } else {
      if (stats.videoTrackSummary.muted > 0 && stats.videoTrackSummary.muted === stats.videoTrackSummary.count) {
        counter.receivedVideo++;
        hasReceivedVideo = true;
      }
    }
    if (hasReceivedVideo && hasReceivedAudio) {
      counter.receivedMedia++;
    }
  }
  buildMaxJitter(maxJitter, stats) {
    if (maxJitter < stats.videoTrackSummary.maxJitter) {
      maxJitter = stats.videoTrackSummary.maxJitter;
    }
    if (maxJitter < stats.audioTrackSummary.maxJitter) {
      maxJitter = stats.audioTrackSummary.maxJitter;
    }
    return maxJitter;
  }
  buildMaxPacketLoss(maxPacketLoss, stats) {
    if (maxPacketLoss < stats.videoTrackSummary.maxPacketLoss) {
      maxPacketLoss = stats.videoTrackSummary.maxPacketLoss;
    }
    if (maxPacketLoss < stats.audioTrackSummary.maxPacketLoss) {
      maxPacketLoss = stats.audioTrackSummary.maxPacketLoss;
    }
    return maxPacketLoss;
  }
  countConcealedAudio(summaryCounter, stats) {
    summaryCounter.concealedAudio += stats.audioTrackSummary.concealedAudio;
    summaryCounter.totalAudio += stats.audioTrackSummary.totalAudio;
  }
}
exports.SummaryStatsReportGatherer = SummaryStatsReportGatherer;