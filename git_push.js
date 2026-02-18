const { execSync } = require('child_process');
const fs = require('fs');

const cwd = 'd:\\Mostaim Dev\\ecofydk-main';
const output = [];

try {
    output.push('=== GIT STATUS ===');
    output.push(execSync('git status --short', { cwd, encoding: 'utf8' }));

    output.push('=== GIT ADD ===');
    output.push(execSync('git add -A', { cwd, encoding: 'utf8' }));

    output.push('=== GIT COMMIT ===');
    output.push(execSync('git commit -m "feat: Add Admin Issue Tracker with auto-screenshot and URL tracking"', { cwd, encoding: 'utf8' }));

    output.push('=== GIT PUSH ===');
    output.push(execSync('git push origin main', { cwd, encoding: 'utf8' }));

    output.push('=== DONE ===');
} catch (e) {
    output.push('ERROR: ' + e.message);
    if (e.stdout) output.push('STDOUT: ' + e.stdout.toString());
    if (e.stderr) output.push('STDERR: ' + e.stderr.toString());
}

fs.writeFileSync('d:\\Mostaim Dev\\ecofydk-main\\git_result.txt', output.join('\n'));
