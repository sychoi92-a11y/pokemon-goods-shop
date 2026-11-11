import { execSync } from 'child_process'
import { rmSync, existsSync } from 'fs'
import { join } from 'path'

console.log('📦 Building project...')
execSync('npm run build', { stdio: 'inherit' })

const gitDir = join(process.cwd(), 'dist', '.git')
if (existsSync(gitDir)) {
  rmSync(gitDir, { recursive: true, force: true })
}

console.log('🚀 Deploying to GitHub Pages (gh-pages branch)...')
execSync('git init -b gh-pages', { cwd: 'dist', stdio: 'inherit' })
execSync('git config user.name "Trainer"', { cwd: 'dist', stdio: 'inherit' })
execSync('git config user.email "trainer@pokemon.local"', { cwd: 'dist', stdio: 'inherit' })
execSync('git add -A', { cwd: 'dist', stdio: 'inherit' })
execSync('git commit -m "Deploy to GitHub Pages"', { cwd: 'dist', stdio: 'inherit' })
execSync('git push -f https://github.com/sychoi92-a11y/pokemon-goods-shop.git gh-pages', { cwd: 'dist', stdio: 'inherit' })

rmSync(gitDir, { recursive: true, force: true })
console.log('✨ Deployed successfully to https://sychoi92-a11y.github.io/pokemon-goods-shop/!')
