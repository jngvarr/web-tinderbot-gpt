const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
        this.mode = null;
        this.list = [];
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
        const myMessage = await this.sendText("Ваше сообщение отправлено. Ожидайте....")
        const answer = await chat.sendQuestion("Ответь на вопрос: ", msg.text);
        await this.editText(myMessage, answer);
    }

    async date(msg) {
        this.mode = "date"
        await this.sendImage("date");
        const text = this.loadMessage("date")
        await this.sendTextButtons(text, {
                "date_grande": "Ариана Гранде",
                "date_robbie": "Марго Робби",
                "date_zendaya": "Зендея",
                "date_gosling": "Райн Гослинг",
                "date_hardy": "Том Харди",
            }
        )
    }

    async dateButton(callbackQuery) {
        const query = callbackQuery.data;
        // await this.sendText(query)
        await this.sendImage(query);
        await this.sendText("Хороший выбор! У тебя одна попытка!!   ");

        chat.setPrompt(this.loadPrompt(query));
    }

    async dateDialog(msg) {
        const answer = await chat.addMessage(msg.text);
        const message = await this.sendText("Собеседник набирает текст....")
        await this.editText(message, answer);
    }

    async message(msg) {
        this.mode = "message";
        await this.sendImage("message");
        const text = this.loadMessage("message")
        await this.sendTextButtons(text, {
            "message_next": "Новое сообщение",
            "message_date": "Пригласить на свидание",
        })
    }

    async messageButton(callbackQuery) {
        // const query = callbackQuery.data;
        // await this.sendText(query);
        const prompt = this.loadPrompt(callbackQuery.data);
        // const userChatHistory = this.list.join("\n\n");
        const myMessage = await this.sendText("ChatGPT выбирает вариант ответа....")
        const answer = await chat.sendQuestion(prompt, this.list.join("\n\n"));
        await this.editText(myMessage, answer)
        // this.list.forEach(msg => {this.sendText(msg, myMessage)});
        // console.log(this.list);
        this.list = []
        // console.log(this.list);
    }

    async messageDialog(msg) {
        this.list.push(msg.text);
    }

    async hello(msg) {
        if (this.mode === "gpt")
            await this.gptDialog(msg);
        else if (this.mode === "date")
            await this.dateDialog(msg);
        else if (this.mode === "message")
            await this.messageDialog(msg);
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
bot.onCommand(/\/date/, bot.date) // date
bot.onCommand(/\/message/, bot.message) // message
bot.onTextMessage(bot.hello)
bot.onButtonCallback(/^date_.*/, bot.dateButton) // date
bot.onButtonCallback(/^message_.*/, bot.messageButton) // message
bot.onButtonCallback(/^.*/, bot.helloButton) // any string
