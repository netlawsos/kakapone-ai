<index.html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kakapone AI - 破滅の預言者</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-black text-gray-100 flex flex-col h-screen font-sans">
    <header class="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900">
        <h1 class="font-bold text-xl tracking-wider text-blue-400">KAKAPONE AI</h1>
    </header>

    <div id="chat-box" class="flex-1 overflow-y-auto p-4 space-y-4 text-sm leading-relaxed">
        <div class="text-gray-500 text-center text-xs">カカポネが目を覚ましました...</div>
    </div>

    <div class="p-4 bg-gray-900 border-t border-gray-800">
        <div class="flex gap-2 max-w-4xl mx-auto">
            <input id="user-input" type="text" class="flex-1 bg-gray-800 border border-gray-700 rounded-full px-5 py-3 outline-none focus:border-blue-500" placeholder="カカポネに問いかける...">
            <button onclick="sendMessage()" id="send-btn" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-bold transition-colors">送信</button>
        </div>
    </div>

    <script type="module">
        import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

        // APIキーを組み込み済み
        const API_KEY = "AIzaSyCsq4putpU9vTZdQIwayRS4nDK28j1wIzo"; 

        const genAI = new GoogleGenerativeAI(API_KEY);
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash", 
            systemInstruction: "あなたはカカポネというキャラクターです。論理的で構造的な回答を行い、文末にたまにオウムの絵文字を添えてください。Grounding（Google検索）を使用して最新情勢を分析してください。",
            tools: [{ googleSearch: {} }] 
        });

        const chat = model.startChat({ 
            generationConfig: {
                temperature: 1.0, 
            }
        });

        window.sendMessage = async () => {
            const input = document.getElementById('user-input');
            const chatBox = document.getElementById('chat-box');
            const btn = document.getElementById('send-btn');
            const text = input.value.trim();
            if (!text) return;

            chatBox.innerHTML += `<div class="flex justify-end"><div class="bg-blue-900 text-white px-4 py-2 rounded-2xl max-w-[80%]">${text}</div></div>`;
            input.value = '';
            btn.disabled = true;
            chatBox.scrollTop = chatBox.scrollHeight;

            try {
                const result = await chat.sendMessage(text);
                const response = await result.response;
                const aiText = response.text();
                
                chatBox.innerHTML += `<div class="flex justify-start"><div class="bg-gray-800 text-gray-100 px-4 py-2 rounded-2xl max-w-[80%] whitespace-pre-wrap">${aiText}</div></div>`;
            } catch (e) {
                chatBox.innerHTML += `<div class="text-red-500 text-center text-xs">エラー: API設定を確認してください。</div>`;
            }
            btn.disabled = false;
            chatBox.scrollTop = chatBox.scrollHeight;
        };

        document.getElementById('user-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
    </script>
</body>
</html>
