require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

# One podspec for both Apple platforms, named after the package folder.
# Autolinking does not read `podspecPath` from `react-native.config.cjs`: it
# takes `<folder>.podspec` if there is one and the first `*.podspec` by name
# otherwise — which, with an iOS and a macOS file side by side, was the macOS
# one for iOS. Each platform lists its own sources.
Pod::Spec.new do |s|
  s.name         = 'building_blocks_rn'
  s.version      = package['version']
  s.summary      = package['description']
  s.homepage     = 'https://github.com/sudobility/building_blocks_rn'
  s.license      = package['license']
  s.author       = 'Sudobility'
  s.source       = { :git => 'https://github.com/sudobility/building_blocks_rn.git', :tag => s.version }

  s.ios.deployment_target = '15.1'
  s.osx.deployment_target = '14.0'

  s.ios.source_files = 'ios/**/*.{h,m,mm}'
  s.ios.frameworks   = 'UIKit'

  s.osx.source_files = 'macos/**/*.{h,m,mm}'
  s.osx.frameworks   = 'AuthenticationServices', 'Security', 'StoreKit'

  s.dependency 'React-Core'
end
