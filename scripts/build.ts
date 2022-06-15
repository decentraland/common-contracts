import fs from 'fs'
import path from 'path'

/**
 * NOTE:
 * Publishing the package generated here will allow imports on contracts to be similar to openzeppelin ones.
 * For example, Instead of:
 * import "@dcl/common-contracts/contracts/meta-transactions/NativeMetaTransaction.sol", we can have:
 * import "@dcl/common-contracts/meta-transactions/NativeMetaTransaction.sol", removing an extra path segment.
 */

const rootPath = path.resolve(__dirname, '..')
const distPath = path.resolve(rootPath, 'dist')

// root directories from the contracts folder that will be included in the package.
const roots = ['meta-transactions', 'signatures']

// Delete the existing dist folder if it exists.
if (fs.existsSync(distPath)) {
  fs.rmSync(distPath, { recursive: true, force: true })
}

// Create the dist folder.
fs.mkdirSync(distPath)

// Copy the package json into dist and add the roots as the included files.
const packageJson = JSON.parse(fs.readFileSync(path.resolve(rootPath, 'package.json'), 'utf-8'))

packageJson.files = roots.map((r) => `./${r}/**/*.sol`)

fs.writeFileSync(path.resolve(distPath, 'package.json'), JSON.stringify(packageJson, null, 2))

// Copy the included contract root directories from the contracts folder into dist.
roots.forEach((r) => {
  const origin = path.resolve(rootPath, 'contracts', r)
  const destination = path.resolve(distPath, r)

  fs.cpSync(origin, destination, { recursive: true, force: true })
})
