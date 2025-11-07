#!/bin/bash

# 发布 packages 目录下除了 frontend-lint-local 之外的所有包到 npm
# 使用方式: ./publish-packages.sh <otp-code>

OTP=$1

if [ -z "$OTP" ]; then
  echo "错误: 请提供 OTP 码"
  echo "使用方式: ./publish-packages.sh <otp-code>"
  echo "例如: ./publish-packages.sh 123456"
  exit 1
fi

echo "开始发布包到 npm..."
echo ""

# 发布顺序：先发布配置包，最后发布 fe-lint-yan（因为它依赖其他包）

packages=(
  "commitlint-config-yan"
  "eslint-config-yan"
  "eslint-plugin-yan"
  "markdownlint-config-yan"
  "stylelint-config-yan"
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

