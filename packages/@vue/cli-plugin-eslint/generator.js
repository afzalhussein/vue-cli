module.exports = (api, { config, lintOn }) => {
  const pkg = {
    scripts: {
      lint: 'vue-cli-service lint'
    },
    eslintConfig: {
      extends: ['plugin:vue/essential']
    },
    dependencies: {
      'eslint-plugin-vue': '^4.1.0'
    }
  }

  if (config === 'airbnb') {
    pkg.eslintConfig.extends.push('@vue/airbnb')
    Object.assign(pkg.dependencies, {
      '@vue/eslint-config-airbnb': '^3.0.0-alpha.1'
    })
  } else if (config === 'standard') {
    pkg.eslintConfig.extends.push('@vue/standard')
    Object.assign(pkg.dependencies, {
      '@vue/eslint-config-standard': '^3.0.0-alpha.1'
    })
  } else if (config === 'prettier') {
    // TODO
  } else {
    // default
    pkg.eslintConfig.extends.push('eslint:recommended')
  }

  if (lintOn === 'save') {
    pkg.vue = {
      lintOnSave: true // eslint-loader configured in runtime plugin
    }
  }

  if (lintOn === 'commit') {
    pkg.devDependencies = {
      'lint-staged': '^6.0.0'
    }
    pkg.gitHooks = {
      'pre-commit': 'lint-staged'
    }
    pkg['lint-staged'] = {
      '*.js': ['vue-cli-service lint', 'git add'],
      '*.vue': ['vue-cli-service lint', 'git add']
    }
  }

  api.extendPackage(pkg)

  // lint & fix after create to ensure files adhere to chosen config
  if (config && config !== 'base') {
    api.onCreateComplete(() => {
      require('./lint')(api.resolve('.'), { silent: true })
    })
  }
}
