module.exports = {
 
  defaultSeverity: 'warning', // 默认所有规则都是warning级别
  plugins: ['stylelint-scss'], // 使用stylelint-scss插件
  rules: {
    /**
     * Possible errors
     * @link https://stylelint.io/user-guide/rules/#possible-errors
     */
    
    'at-rule-no-unknown': null, // 关闭标准的检查，因为不认识 SCSS 的 @mixin, @include 等 如@unknown-rule { }  /* 未知规则 */
    'scss/at-rule-no-unknown': true, // 开启 SCSS 的 @mixin, @include 等检查
    'block-no-empty': null, // 关闭空块的检查
    'color-no-invalid-hex': true, // 开启颜色值的检查
    'comment-no-empty': true, // 开启注释的检查
    'declaration-block-no-duplicate-properties': [true, { ignore: ['consecutive-duplicates-with-different-values'] }], // 开启声明块的检查
    'declaration-block-no-shorthand-property-overrides': true,
    'font-family-no-duplicate-names': true, // 开启字体名称的检查
    'function-calc-no-unspaced-operator': true, // 开启计算函数的检查
    'function-linear-gradient-no-nonstandard-direction': true, // 开启线性渐变的检查
    'keyframe-declaration-no-important': true, // 开启关键帧的检查
    'media-feature-name-no-unknown': true, // 开启媒体特征名称的检查
    'no-descending-specificity': null, // @reason 实际有很多这样用的，且多数人熟悉 css 优先级
    'no-duplicate-at-import-rules': true, // 开启导入规则的检查
    'no-duplicate-selectors': true, // 开启选择器的检查
    'no-empty-source': null,
    'no-extra-semicolons': true, // 开启分号的检查
    'no-invalid-double-slash-comments': true, // 开启双斜杠注释的检查
    'property-no-unknown': true, // 开启属性的检查
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local', 'export'] }], // 开启伪类选择的检查
    'selector-pseudo-element-no-unknown': true, // 开启伪元素选择的检查
    'string-no-newline': true, // 开启字符串的检查
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }], // 开启单位的检查

    /**
     * Stylistic issues
     * @link https://stylelint.io/user-guide/rules/list#stylistic-issues
     */
    indentation: 2, // 开启缩进的检查 
    'block-closing-brace-newline-before': 'always-multi-line', // 开启块的关闭括号的检查
    'block-closing-brace-space-before': 'always-single-line',
    'block-opening-brace-newline-after': 'always-multi-line', // 开启块的打开括号的检查
    'block-opening-brace-space-before': 'always', // 开启块的打开括号的检查
    'block-opening-brace-space-after': 'always-single-line', // 开启块的打开括号的检查
    'color-hex-case': 'lower', // 开启颜色的检查
    'color-hex-length': 'short', // 开启颜色的检查
    'comment-whitespace-inside': 'always', // 开启注释的检查
    'declaration-colon-space-before': 'never', // 开启声明的检查
    'declaration-colon-space-after': 'always', // 开启声明的检查
    'declaration-block-single-line-max-declarations': 1, // 开启声明的检查
    'declaration-block-trailing-semicolon': ['always', { severity: 'error' }], // 开启声明的检查
    'length-zero-no-unit': [true, { ignore: ['custom-properties'] }], // 开启长度的检查
    'max-line-length': 100, // 开启最大长度的检查
    'selector-max-id': 0, // 开启选择器的检查
    'value-list-comma-space-after': 'always-single-line', // 开启值的检查

    /**
     * stylelint-scss rules
     * @link https://www.npmjs.com/package/stylelint-scss
     */
    'scss/double-slash-comment-whitespace-inside': 'always', // 开启双斜杠注释的检查
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'], // 忽略的文件
};