/*
Copyright 2026 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE in the repository root for full details.
*/

export interface RingtonePlaybackConfig {
  shouldPlay: boolean;
  volume: number;
}

export interface RingtonePlaybackState {
  shouldPlay: boolean;
  volume: number;
}

/**
 * 将宿主应用返回的系统铃声配置折算成网页侧最终要采用的播放策略。
 *
 * - 浏览器环境下没有原生配置时，保持现有网页音量逻辑不变；
 * - Android WebView 下则额外叠加系统铃声音量，并在系统要求静音时直接禁止播放。
 */
export function resolveRingtonePlayback(
  baseVolume: number,
  nativeConfig?: RingtonePlaybackConfig,
): RingtonePlaybackState {
  if (!nativeConfig) {
    return {
      shouldPlay: baseVolume > 0,
      volume: baseVolume,
    };
  }

  const nativeVolume = clamp(nativeConfig.volume, 0, 1);
  const effectiveVolume = baseVolume * nativeVolume;
  return {
    shouldPlay: nativeConfig.shouldPlay && effectiveVolume > 0,
    volume: nativeConfig.shouldPlay ? effectiveVolume : 0,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
