/*
Copyright 2024-2025 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE in the repository root for full details.
*/

import { Subject } from "rxjs";
import { logger } from "matrix-js-sdk/lib/logger";

import { type RingtonePlaybackConfig } from "./ringtonePlayback";

export interface Controls {
  canEnterPip(): boolean;
  enablePip(): void;
  disablePip(): void;

  setAvailableAudioDevices(devices: OutputDevice[]): void;
  setAudioDevice(id: string): void;
  onAudioDeviceSelect?: (id: string) => void;
  onAudioPlaybackStarted?: () => void;
  getNativeRingtonePlaybackConfig?: () => RingtonePlaybackConfig;
  setAudioEnabled(enabled: boolean): void;
  showNativeAudioDevicePicker?: () => void;
  onBackButtonPressed?: () => void;

  /** @deprecated use  setAvailableAudioDevices instead*/
  setAvailableOutputDevices(devices: OutputDevice[]): void;
  /** @deprecated use  setAudioDevice instead*/
  setOutputDevice(id: string): void;
  /** @deprecated use  onAudioDeviceSelect instead*/
  onOutputDeviceSelect?: (id: string) => void;
  /** @deprecated use  setAudioEnabled instead*/
  setOutputEnabled(enabled: boolean): void;
  /** @deprecated use  showNativeAudioDevicePicker instead*/
  showNativeOutputDevicePicker?: () => void;
}

export interface OutputDevice {
  id: string;
  name: string;
  forEarpiece?: boolean;
  isEarpiece?: boolean;
  isSpeaker?: boolean;
  isExternalHeadset?: boolean;
}

/**
 * If pipMode is enabled, EC will render a adapted call view layout.
 */
export const setPipEnabled$ = new Subject<boolean>();

export const availableOutputDevices$ = new Subject<OutputDevice[]>();

export const outputDevice$ = new Subject<string>();

/**
 * This allows the os to mute the call if the user
 * presses the volume down button when it is at the minimum volume.
 *
 * This should also be used to display a darkened overlay screen letting the user know that audio is muted.
 */
export const setAudioEnabled$ = new Subject<boolean>();

let playbackStartedEmitted = false;
export const setPlaybackStarted = (): void => {
  if (!playbackStartedEmitted) {
    playbackStartedEmitted = true;
    window.controls.onAudioPlaybackStarted?.();
  }
};

function pipDebugContext(): string {
  return `observed=${setPipEnabled$.observed} window=${window.innerWidth}x${window.innerHeight}`;
}

window.controls = {
  canEnterPip(): boolean {
    const canEnterPip = setPipEnabled$.observed;
    // 记录原生在进入 Android PiP 前向 Web 侧探测能力时的上下文，便于和宿主侧日志对齐。
    logger.info(
      `[controls] canEnterPip called: canEnterPip=${canEnterPip} ${pipDebugContext()}`,
    );
    return canEnterPip;
  },
  enablePip(): void {
    logger.info(`[controls] enablePip called: ${pipDebugContext()}`);
    if (!setPipEnabled$.observed) throw new Error("No call is running");
    setPipEnabled$.next(true);
  },
  disablePip(): void {
    logger.info(`[controls] disablePip called: ${pipDebugContext()}`);
    if (!setPipEnabled$.observed) throw new Error("No call is running");
    setPipEnabled$.next(false);
  },

  setAvailableAudioDevices(devices: OutputDevice[]): void {
    logger.info("setAvailableAudioDevices called from native:", devices);
    availableOutputDevices$.next(devices);
  },
  setAudioDevice(id: string): void {
    logger.info("setAudioDevice called from native", id);
    outputDevice$.next(id);
  },
  setAudioEnabled(enabled: boolean): void {
    logger.info("setAudioEnabled called from native:", enabled);
    if (!setAudioEnabled$.observed)
      throw new Error(
        "Output controls are disabled. No setAudioEnabled$ observer",
      );
    setAudioEnabled$.next(enabled);
  },

  // wrappers for the deprecated controls fields
  setOutputEnabled(enabled: boolean): void {
    this.setAudioEnabled(enabled);
  },
  setAvailableOutputDevices(devices: OutputDevice[]): void {
    this.setAvailableAudioDevices(devices);
  },
  setOutputDevice(id: string): void {
    this.setAudioDevice(id);
  },
};
