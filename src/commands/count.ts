import { GluegunToolbox } from 'gluegun'

module.exports = {
  run: async (toolbox: GluegunToolbox) => {
    const { print, parameters, filesystem } = toolbox
    const {
      colors: { magenta }
    } = print
    const folder = parameters.first

    print.info('Counting source files in ' + magenta(folder))

    const matching = '*(*.ts|*.html|*.css)'
    const files = filesystem.find(folder, { matching })

    const initialData = {
      ts: 0,
      html: 0,
      css: 0
    }

    const data = files.reduce((data, file) => {
      // get the file extension
      const fileExt = file.split('.').pop()

      // get the lines of code
      const lines = filesystem.read(file).split('\n').length

      // add lines of code to the appropriate extension
      data[fileExt] += lines

      // return the new data "accumulator"
      return data
    }, initialData)

    const formattedData = [['Type', 'Lines of code'], ...Object.entries(data)]

    print.info('')
    print.table(formattedData, { format: 'lean' })
  }
}
