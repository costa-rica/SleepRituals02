/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Adapted from: https://github.com/mmazzarolo/breathly-app
 * Original author: Matteo Mazzarolo
 */

import React, { FC } from "react";
import { Animated, StyleSheet } from "react-native";
import { interpolateTranslateY } from "./utils";

interface Props {
  label: string;
  animationValue: Animated.Value;
}

export const StepDescription: FC<Props> = ({ label, animationValue }) => {
  const textAnimatedStyle = {
    opacity: animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      interpolateTranslateY(animationValue, {
        inputRange: [0, 1],
        outputRange: [0, -8],
      }),
    ],
  };

  return (
    <Animated.Text
      style={[styles.text, textAnimatedStyle]}
    >
      {label}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  text: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '200',
    color: 'rgba(255, 255, 255, 0.95)',
  },
});
