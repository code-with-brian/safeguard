import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/auth';

export default function SetupScreen() {
  const { completeSetup } = useAuthStore();
  const [step, setStep] = useState(1);
  const [childName, setChildName] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsLoading(true);
    // In a real app, this would verify the family code with the server
    // and get the actual childId and familyId
    setTimeout(() => {
      completeSetup(
        `child_${Date.now()}`,
        familyCode || `family_${Date.now()}`
      );
      setIsLoading(false);
    }, 1000);
  };

  const steps = [
    {
      title: 'Welcome to SafeGuard',
      description: 'This app helps keep you safe online while respecting your privacy.',
      icon: 'shield-checkmark',
    },
    {
      title: 'What is SafeGuard?',
      description: 'Your parents care about your safety. SafeGuard monitors concerning activity and alerts them only when necessary.',
      icon: 'information-circle',
    },
    {
      title: 'Connect to Your Family',
      description: 'Enter the family code from your parent\'s SafeGuard account to get started.',
      icon: 'people',
    },
  ];

  const currentStep = steps[step - 1];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                s === step && styles.progressDotActive,
                s < step && styles.progressDotCompleted,
              ]}
            />
          ))}
        </View>

        {/* Step Content */}
        <View style={styles.stepContent}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={currentStep.icon as any}
              size={64}
              color="#3b82f6"
            />
          </View>
          
          <Text style={styles.title}>{currentStep.title}</Text>
          <Text style={styles.description}>{currentStep.description}</Text>

          {step === 3 && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Your Name</Text>
              <TextInput
                style={styles.input}
                value={childName}
                onChangeText={setChildName}
                placeholder="Enter your name"
                placeholderTextColor="#9ca3af"
              />
              
              <Text style={styles.inputLabel}>Family Code</Text>
              <TextInput
                style={styles.input}
                value={familyCode}
                onChangeText={setFamilyCode}
                placeholder="Enter code from parent app"
                placeholderTextColor="#9ca3af"
                autoCapitalize="characters"
              />
              
              <Text style={styles.helpText}>
                Ask your parent for the family code from their SafeGuard dashboard.
              </Text>
            </View>
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep(step - 1)}
              disabled={isLoading}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.nextButton,
              step === 3 && !childName && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={step === 3 && !childName || isLoading}
          >
            {isLoading ? (
              <Ionicons name="refresh" size={24} color="#fff" />
            ) : (
              <Text style={styles.nextButtonText}>
                {step === 3 ? 'Get Started' : 'Next'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  progressDotActive: {
    backgroundColor: '#3b82f6',
    transform: [{ scale: 1.2 }],
  },
  progressDotCompleted: {
    backgroundColor: '#22c55e',
  },
  stepContent: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  inputContainer: {
    width: '100%',
    marginTop: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
  },
  helpText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  nextButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
