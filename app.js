const figlet = require('figlet')
const fs = require('fs')
const path = require('path')

const list = fs.readdirSync('./node_modules/figlet/fonts')

const output = (text, file) => {
	const clean = () => {
		fs.writeFile(file, '', err => {
			if (err) throw err
		})
	}
	const append = t => {
		fs.appendFile(file, t, err => {
			if (err) throw err
		})
	}
	const generate = fontName => {
		return new Promise((resolve, reject) => {
			figlet(text, {
				font: fontName,
				horizontalLayout: 'default',
				verticalLayout: 'default'
			}, (err, data) => {
				if (err) reject()
				resolve(fontName + "\n" + data + "\n")
			})
		})
	}

	Promise.all(
		list.filter(fileName => path.extname(fileName) === '.flf')
			.map(fileName => fileName.match(/(.+)\.[^.]+$/)[1])
			.map(fontName => generate(fontName))
	).then(res => {
		clean()
		append('```' + '\n')
		res.forEach(data => {
			console.log(data)
			append(data)
		})
		append('```')
	})
}

output('pvcresin', 'README.md')