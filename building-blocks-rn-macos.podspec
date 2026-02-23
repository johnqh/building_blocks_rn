require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = 'building-blocks-rn-macos'
  s.version      = package['version']
  s.summary      = package['description']
  s.homepage     = 'https://github.com/sudobility/building_blocks_rn'
  s.license      = package['license']
  s.author       = 'Sudobility'
  s.source       = { :git => 'https://github.com/sudobility/building_blocks_rn.git', :tag => s.version }

  s.osx.deployment_target = '14.0'

  s.source_files = 'macos/**/*.{h,m,mm}'
  s.frameworks   = 'AuthenticationServices', 'Security'

  s.dependency 'React-Core'
end
