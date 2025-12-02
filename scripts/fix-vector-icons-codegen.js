#!/usr/bin/env node

/**
 * Post-install script to fix react-native-vector-icons codegen issue
 * This creates the necessary CMake files that autolinking expects
 */

const fs = require('fs');
const path = require('path');

const vectorIconsPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-vector-icons',
  'android',
  'build',
  'generated',
  'source',
  'codegen',
  'jni',
);

const cmakeListsPath = path.join(vectorIconsPath, 'CMakeLists.txt');
const cppFilePath = path.join(vectorIconsPath, 'RNVectorIconsSpec.cpp');

// Create directory if it doesn't exist
if (!fs.existsSync(vectorIconsPath)) {
  fs.mkdirSync(vectorIconsPath, { recursive: true });
  console.log('✅ Created codegen directory for react-native-vector-icons');
}

// Create CMakeLists.txt
const cmakeContent = `# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

# react-native-vector-icons doesn't use codegen, but autolinking expects this file
# Create an empty object library to satisfy CMake requirements
add_library(
  react_codegen_RNVectorIconsSpec
  OBJECT
  RNVectorIconsSpec.cpp
)

target_include_directories(react_codegen_RNVectorIconsSpec PUBLIC .)

target_link_libraries(
  react_codegen_RNVectorIconsSpec
  fbjni
  jsi
  reactnative
)

target_compile_reactnative_options(react_codegen_RNVectorIconsSpec PRIVATE)
`;

// Create RNVectorIconsSpec.cpp
const cppContent = `// Dummy source file for react-native-vector-icons codegen
// This package doesn't use codegen, but autolinking expects this file
`;

try {
  fs.writeFileSync(cmakeListsPath, cmakeContent);
  fs.writeFileSync(cppFilePath, cppContent);
  console.log('✅ Fixed react-native-vector-icons codegen files');
} catch (error) {
  console.error('❌ Error fixing vector-icons codegen:', error.message);
  process.exit(1);
}

/**
 * Utility to patch gradle files to skip new-architecture assertion checks
 */
const patchNewArchCheck = ({
  filePath,
  originalBlock,
  patchedBlock,
  alreadyPatchedToken,
  name,
}) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  ${name} build.gradle not found. Skipping patch.`);
      return;
    }

    const buildGradleContent = fs.readFileSync(filePath, 'utf8');

    if (buildGradleContent.includes(alreadyPatchedToken)) {
      console.log(`ℹ️  ${name} new-architecture check already patched.`);
      return;
    }

    if (buildGradleContent.includes(originalBlock.trim())) {
      const updatedContent = buildGradleContent.replace(
        originalBlock,
        patchedBlock,
      );
      fs.writeFileSync(filePath, updatedContent);
      console.log(`✅ Patched ${name} new-architecture assertion.`);
    } else {
      console.warn(
        `⚠️  Could not automatically patch ${name} new-architecture assertion. Please update manually if builds fail.`,
      );
    }
  } catch (error) {
    console.error(`❌ Error patching ${name} build.gradle:`, error.message);
    process.exit(1);
  }
};

// Patch Reanimated
patchNewArchCheck({
  filePath: path.join(
    __dirname,
    '..',
    'node_modules',
    'react-native-reanimated',
    'android',
    'build.gradle',
  ),
  originalBlock: `task assertNewArchitectureEnabledTask {
    onlyIf { !IS_NEW_ARCHITECTURE_ENABLED }
    doFirst {
        throw new GradleException("[Reanimated] Reanimated requires new architecture to be enabled. Please enable it by setting \`newArchEnabled\` to \`true\` in \`gradle.properties\`.")
    }
}
`,
  patchedBlock: `def REANIMATED_SKIP_NEW_ARCH_CHECK = safeAppExtGet("reanimatedSkipNewArchCheck", false) || project.hasProperty("reanimatedSkipNewArchCheck")

task assertNewArchitectureEnabledTask {
    onlyIf { !IS_NEW_ARCHITECTURE_ENABLED && !REANIMATED_SKIP_NEW_ARCH_CHECK }
    doFirst {
        throw new GradleException("[Reanimated] Reanimated requires new architecture to be enabled. Please enable it by setting \`newArchEnabled\` to \`true\` in \`gradle.properties\`.")
    }
}
`,
  alreadyPatchedToken: 'REANIMATED_SKIP_NEW_ARCH_CHECK',
  name: 'Reanimated',
});

// Patch Worklets
patchNewArchCheck({
  filePath: path.join(
    __dirname,
    '..',
    'node_modules',
    'react-native-worklets',
    'android',
    'build.gradle',
  ),
  originalBlock: `task assertNewArchitectureEnabledTask {
    onlyIf { !IS_NEW_ARCHITECTURE_ENABLED }
    doFirst {
        throw new GradleException("[Worklets] Worklets require new architecture to be enabled. Please enable it by setting \`newArchEnabled\` to \`true\` in \`gradle.properties\`.")
    }
}
`,
  patchedBlock: `def WORKLETS_SKIP_NEW_ARCH_CHECK = project.hasProperty("reanimatedSkipNewArchCheck") || project.hasProperty("workletsSkipNewArchCheck")

task assertNewArchitectureEnabledTask {
    onlyIf { !IS_NEW_ARCHITECTURE_ENABLED && !WORKLETS_SKIP_NEW_ARCH_CHECK }
    doFirst {
        throw new GradleException("[Worklets] Worklets require new architecture to be enabled. Please enable it by setting \`newArchEnabled\` to \`true\` in \`gradle.properties\`.")
    }
}
`,
  alreadyPatchedToken: 'WORKLETS_SKIP_NEW_ARCH_CHECK',
  name: 'Worklets',
});
