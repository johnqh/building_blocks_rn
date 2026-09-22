#pragma once

#include <Windows.h>
#include <wincrypt.h>

#include <string>
#include <vector>

#pragma comment(lib, "crypt32.lib")

namespace BuildingBlocksRN::Windows {

// Shared Windows file-system primitive used by app-specific native modules.
// Returns an empty string on failure; callers distinguish an empty file from
// encoding failure using the original byte vector.
inline std::string EncodeBase64(const std::vector<char> &bytes) {
  if (bytes.empty()) {
    return {};
  }

  DWORD length = 0;
  const auto *data = reinterpret_cast<const BYTE *>(bytes.data());
  if (!CryptBinaryToStringA(data, static_cast<DWORD>(bytes.size()),
                            CRYPT_STRING_BASE64 | CRYPT_STRING_NOCRLF, nullptr,
                            &length)) {
    return {};
  }

  std::string encoded(length, '\0');
  if (!CryptBinaryToStringA(data, static_cast<DWORD>(bytes.size()),
                            CRYPT_STRING_BASE64 | CRYPT_STRING_NOCRLF,
                            encoded.data(), &length)) {
    return {};
  }
  encoded.resize(length);
  return encoded;
}

} // namespace BuildingBlocksRN::Windows
