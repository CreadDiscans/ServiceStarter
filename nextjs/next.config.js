const { i18n } = require('./next-i18next.config')

module.exports = {
    webpack: (config, { defaultLoaders }) => {
        config.module.rules.push({
          test: /\.css$/,
          use: [
            defaultLoaders.babel,
            {
              loader: require('styled-jsx/webpack').loader,
              options: {
                type: 'scoped'
              }
            }
          ]
        })
    
        return config
      },
      i18n,
}