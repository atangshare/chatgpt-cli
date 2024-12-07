#!/usr/bin/env node
import readline from 'readline/promises';
import OpenAI from 'openai';

// 移除openai sdk对nodejs 22的警告
process.removeAllListeners('warning');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const messages = [
    {role: 'system', content: 'You are a helpful ai assistant.'},
];

async function getAIResponse(userInput) {
    messages.push({role: 'user', content: userInput});
    const stream =  await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: messages,
        stream: true
    });

    process.stdout.write('AI: ');
    let assistantResponse = '';
    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        assistantResponse += content;
        process.stdout.write(content);
    }
    messages.push({role: 'assistant', content: assistantResponse});
    process.stdout.write('\n\n');
}

async function main() {
    while(true) {
        // 1. get user input
        const userInput = await rl.question('ME: ');

        // 2. invoke api
        await getAIResponse(userInput);
    }
}

main();