import { Profile } from "@shared/schema";

export interface MatchingCriteria {
  name: string;
  age: number;
  gender: string;
  profession?: string;
  height: string;
}

export interface MatchResult {
  inputProfile: MatchingCriteria;
  matchedProfile: Profile;
  compatibilityScore: number;
}

export function parseHeight(height: string): number {
  // Convert height string like "5'6\"" to inches
  const match = height.match(/(\d+)'(\d+)"/);
  if (match) {
    const feet = parseInt(match[1]);
    const inches = parseInt(match[2]);
    return feet * 12 + inches;
  }
  return 0;
}

export function isCompatibleMatch(
  inputCriteria: MatchingCriteria,
  candidateProfile: Profile
): boolean {
  const { age: inputAge, gender: inputGender, height: inputHeight } = inputCriteria;
  const { age: candidateAge, gender: candidateGender, height: candidateHeight } = candidateProfile;

  // Must be opposite gender
  if (inputGender === candidateGender) {
    return false;
  }

  const inputHeightInches = parseHeight(inputHeight);
  const candidateHeightInches = parseHeight(candidateHeight);

  if (inputGender === "Male") {
    // Male looking for female
    // Female should be 3-6 years younger and 6-8 inches shorter
    const ageDiff = inputAge - candidateAge;
    const heightDiff = inputHeightInches - candidateHeightInches;

    return ageDiff >= 3 && ageDiff <= 6 && heightDiff >= 6 && heightDiff <= 8;
  } else {
    // Female looking for male
    // Male should be 3-6 years older and 6-8 inches taller
    const ageDiff = candidateAge - inputAge;
    const heightDiff = candidateHeightInches - inputHeightInches;

    return ageDiff >= 3 && ageDiff <= 6 && heightDiff >= 6 && heightDiff <= 8;
  }
}

export function calculateCompatibilityScore(
  inputCriteria: MatchingCriteria,
  matchedProfile: Profile
): number {
  let score = 85; // Base score

  // Add points for profession compatibility (if groom has profession)
  if (inputCriteria.profession && matchedProfile.profession) {
    score += 5;
  }

  // Add random variation for realistic scoring
  score += Math.floor(Math.random() * 10);

  return Math.min(score, 100);
}

export function findMatches(
  inputCriteria: MatchingCriteria,
  candidateProfiles: Profile[]
): Profile[] {
  return candidateProfiles.filter(profile =>
    isCompatibleMatch(inputCriteria, profile)
  );
}

export function selectRandomMatch(compatibleMatches: Profile[]): Profile | null {
  if (compatibleMatches.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * compatibleMatches.length);
  return compatibleMatches[randomIndex];
}
