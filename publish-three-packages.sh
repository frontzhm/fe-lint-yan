#!/bin/bash

# 发布三个包：markdownlint-config-yan, commitlint-config-yan, fe-lint-yan
# 使用方式: ./publish-three-packages.sh <otp-code>

OTP=$1

if [ -z "$OTP" ]; then
  echo "错误: 请提供 OTP 码"
  echo "使用方式: ./publish-three-packages.sh <otp-code>"
  echo "例如: ./publish-three-packages.sh 123456"
  exit 1
fi

echo "开始发布包到 npm..."
echo ""

# 发布顺序：先发布配置包，最后发布 fe-lint-yan（因为它依赖其他包）

packages=(
  "markdownlint-config-yan"
  "commitlint-config-yan"
  "fe-lint-yan"
)

for package in "${packages[@]}"; do
  echo "正在发布 $package..."
  
  # 如果是 fe-lint-yan，先构建
  if [ "$package" = "fe-lint-yan" ]; then
    echo "  先构建 $package..."
    pnpm --filter "$package" run build
    if [ $? -ne 0 ]; then
      echo "✗ $package 构建失败"
      exit 1
    fi
  fi
  
  pnpm publish --filter "$package" --otp="$OTP" --no-git-checks
  
  if [ $? -eq 0 ]; then
    echo "✓ $package 发布成功"
  else
    echo "✗ $package 发布失败"
    exit 1
  fi
  echo ""
done

echo "所有包发布完成！"

