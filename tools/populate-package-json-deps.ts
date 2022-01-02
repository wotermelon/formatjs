import {readJSONSync, writeJSONSync} from 'fs-extra'
import minimist from 'minimist'
const unidiff = require('unidiff')

interface Args {
  packageJson: string
  peerDependency: string[]
  rootPackageJson: string
  out: string
  internalDepPackageJson: string | string[]
  externalDep: string | string[]
}

function main(args: Args) {
  const {
    externalDep,
    internalDepPackageJson,
    packageJson,
    rootPackageJson,
    peerDependency,
    out,
  } = args
  const externalDeps = Array.isArray(externalDep)
    ? externalDep
    : externalDep
    ? [externalDep]
    : []
  const internalDepPackageJsons = Array.isArray(internalDepPackageJson)
    ? internalDepPackageJson
    : internalDepPackageJson
    ? [internalDepPackageJson]
    : []
  const peerDependencies = Array.isArray(peerDependency)
    ? peerDependency
    : peerDependency
    ? [peerDependency]
    : []
  const packageJsonContent = readJSONSync(packageJson)
  const rootPackageJsonContent = readJSONSync(rootPackageJson)
  const internalPackageJsonContents = internalDepPackageJsons.map(p =>
    readJSONSync(p)
  )
  const {devDependencies: rootDependencies} = rootPackageJsonContent
  const expectedDependencies = {
    tslib: rootDependencies.tslib,
    ...externalDeps.reduce((all: Record<string, string>, dep) => {
      all[dep] = rootDependencies[dep]
      return all
    }, {}),
    ...internalPackageJsonContents.reduce((all: Record<string, string>, c) => {
      all[c.name] = c.version
      return all
    }, {}),
  }
  if (packageJsonContent.dependencies) {
    packageJsonContent.dependencies = Object.keys(
      packageJsonContent.dependencies
    )
      .filter(dep => peerDependencies.includes(dep))
      .reduce((all, dep) => {
        all[dep] = expectedDependencies[dep]
        return all
      }, {})
  }
  packageJsonContent.peerDependencies = Object.keys(peerDependencies).reduce(
    (all, dep) => {
      all[dep] = expectedDependencies[dep]
      return all
    },
    {}
  )
  writeJSONSync(out, packageJsonContent, {
    spaces: 2,
  })
}

if (require.main === module) {
  main(minimist<Args>(process.argv.slice(2)))
}
