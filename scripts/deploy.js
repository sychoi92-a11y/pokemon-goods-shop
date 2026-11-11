import { execSync } from 'child_process'
import { rmSync, existsSync, writeFileSync, copyFileSync } from 'fs'
import { join } from 'path'

console.log('📦 Building project with base: /pokemon-goods-shop/ ...')
execSync('npm run build', { stdio: 'inherit' })

// Create .nojekyll to disable Jekyll on GitHub Pages
writeFileSync(join(process.cwd(), 'dist', '.nojekyll'), '')

// Copy index.html to 404.html for SPA fallback
copyFileSync(
  join(process.cwd(), 'dist', 'index.html'),
  join(process.cwd(), 'dist', '404.html')
)

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
