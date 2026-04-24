import paramiko
import sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.76.221', username='root', password='Bangla21@2121', timeout=15)

cmd = sys.argv[1] if len(sys.argv) > 1 else 'echo connected'
stdin, stdout, stderr = ssh.exec_command(cmd, timeout=120)
out = stdout.read().decode()
err = stderr.read().decode()
if out:
    print(out)
if err:
    print("STDERR:", err, file=sys.stderr)
ssh.close()
