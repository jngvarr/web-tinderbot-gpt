const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");
class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
        this.mode = null;
    }

    async start(msg) {
        this.mode = "main"
        const text = this.loadMessage("main")
        await this.sendImage("main")
        await this.sendText(text);
        await this.showMainMenu({
            "start": "главное меню бота",
            "profile": "генерация Tinder-профиля 😎",
            "opener": "сообщение для знакомства 🥰",
            "message": "переписка от вашего имени 😈",
            "date": "переписка со звездами 🔥",
            "gpt": "задать вопрос чату GPT 🧠",
            "html": "посмотреть HTML",
        })
    }

    async html(msg) {
        await this.sendHTML('<h3 style="color: brown"> Привет! </h3>');
        const html = this.loadHtml("main");
        await this.sendHTML(html, {theme: "dark"});
        await this.sendHTML(html, {theme: "light"});
    }

    async gpt(msg) {
        this.mode = "gpt"
        await this.sendImage("gpt");
        const text = this.loadMessage("gpt")
        // await this.sendText("Пообщаемся с ИИ");
        await this.sendText(text);
    }

    async gptDialog(msg) {
        const text = msg.text;
        const answer = await chat.sendQuestion("Ответь на вопрос: ", text);
        await this.sendText(answer);
    }

    async hello(msg) {
        if (this.mode === "gpt")
            await this.gptDialog(msg);
        else {
            const text = msg.text;
            await this.sendText(`Вы писали: ${text}`);
            await this.sendText("<b>Привет</b>");
            await this.sendText("<i>Ответьте пожалуйста на вопрос</i>");

            await this.sendImage("question")

            await this.sendTextButtons("Какого вы пола?", {
                    "male": "Мужчина",
                    "female": "Женщина",
                }
            )
        }
    }

    async helloButton(callbackQuery) {
        const query = callbackQuery.data;
        if (query === "female") {
            await this.sendText("How your doin'?")
            await this.sendImage("joe")
        } else if (query === "male") {
            await this.sendText("Hello Dude!")
            await this.sendImage("joe_m")
        }
    }
}

const bot = new MyTelegramBot("7862159452:AAHKNzowB-C8f-9Ue0Idq-iRzYoG-L7Bgzk");
const chat = new ChatGptService("gpt:ho7T8VOJeY6EVWR4okSxJFkblB3Tp7tf2SeYm4s7gNS3LPJN");

bot.onCommand(/\/start/, bot.start) // start
bot.onCommand(/\/html/, bot.html) // html
bot.onCommand(/\/gpt/, bot.gpt) // gpt
bot.onTextMessage(bot.hello)
bot.onButtonCallback(/^.*/, bot.helloButton) // any string