import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { router } from "expo-router";
import { submitProof } from '../data/taskHandler'
