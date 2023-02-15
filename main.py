import telebot
from telebot import types


import random
bot = telebot.TeleBot("")
QIWI_TOKEN = ""
QIWI_ACCOUNT  = ""
from pyqiwip2p import QiwiP2P
p2p = QiwiP2P(auth_key ="secret")



@bot.message_handler(commands=['start'])
def reg_age(message):
    keyboard = types.InlineKeyboardMarkup()
    key_yes = types.InlineKeyboardButton(text='Выбрать город ', callback_data='info')
    keyboard.add(key_yes)
    question = 'Добро пожаловать, любитель захватывающих мест! Наш бот поможет подобрать подходящую для тебя ////! '
    bot.send_message(message.from_user.id, text = question, reply_markup=keyboard)




@bot.message_handler(commands=['info'])
def stop(message):
    global name
    name = message.text
    bot.send_message(message.from_user.id,
                     "📝 Ваше ФИО в следующем формате: Иванов Иван Иванович.",
                     reply_markup=types.ReplyKeyboardRemove())
    bot.register_next_step_handler(message, reg_name)
def reg_name(message):
    global date
    date = message.text
    bot.send_message(message.from_user.id, "📝 Ваша дата рождения в след формате дд.мм.год: 30.01.1999.")
    bot.register_next_step_handler(message, reg_final)


def reg_final(message):
    global number
    number = message.text
    keyboard = types.InlineKeyboardMarkup()
    key_yes = types.InlineKeyboardButton(text='Да', callback_data='yes1')
    keyboard.add(key_yes)
    key_no = types.InlineKeyboardButton(text='Нет', callback_data='info')
    keyboard.add(key_no)
    question = '🔸 ФИО: ' + name + '; \n🔸 Дата рождения: ' + date + '; \n🔸 ⚠ Все ли верно?'
    bot.send_message(message.from_user.id, text=question, reply_markup=keyboard)


@bot.message_handler(commands=['pay'])
def buy(message: types.Message, price, metro):
    global bill
    lifetime = 15
    id = random.randint(100000, 999999)
    comment = 'Уникальный номер заказа - ' + id + '. Пожалуйста, проверьте не просрочен ли ваш счет, при помощи надписи выше.'
    bill = p2p.bill(bill_id=id, amount=price, lifetime=lifetime, comment=comment)
    link_oplata = bill.pay_url
    keyboard2 = types.InlineKeyboardMarkup()
    key_check = types.InlineKeyboardButton(text='Проверить платеж.', callback_data='check')
    keyboard2.add(key_check)
    question2 = '✅ Станция метро:' +  metro + ';\n✅ Цена: ' + price + ' рублей.\n\n⏱ Счет действителен 15 минут, проверяйте на странице оплаты должна быть надпись с временем действия.\n\n🖥 Ссылка для оплаты: ' + link_oplata + '.'
    bot.send_message(message.from_user.id, text=question2, reply_markup=keyboard2)



@bot.callback_query_handler(func=lambda call: True)
def callback_worker(call):
    if call.data == "info":
        keyboard = types.InlineKeyboardMarkup()
        spb = types.InlineKeyboardButton(text='Санкт-Петербург', callback_data='spb')
        moscow = types.InlineKeyboardButton(text='Москва', callback_data='moscow')
        keyboard.add(spb, moscow)
        question = 'С какого вы города?'
        bot.send_message(call.message.chat.id, question, reply_markup= keyboard)
    if call.data == "spb":
        keyboard = types.InlineKeyboardMarkup()
        spb1 = types.InlineKeyboardButton(text='Старая деревня', callback_data='spb1')
        spb2 = types.InlineKeyboardButton(text='(+)Садовая', callback_data='saint')
        spb3 = types.InlineKeyboardButton(text='Мурино', callback_data='spb3')
        spb4 = types.InlineKeyboardButton(text='Купчино', callback_data='spb4')
        spb5 = types.InlineKeyboardButton(text='Комендантский проспект', callback_data='spb5')
        spb6 = types.InlineKeyboardButton(text='Ладожская', callback_data='spb6')
        spb7 = types.InlineKeyboardButton(text='(+)Василеостровская', callback_data='saint1')
        spb8 = types.InlineKeyboardButton(text='(++)Адмиралтейская', callback_data='spb8')
        spb9 = types.InlineKeyboardButton(text='Московская', callback_data='spb9')
        spb10 = types.InlineKeyboardButton(text='Автово', callback_data='spb10')
        spb11 = types.InlineKeyboardButton(text='Бухарестская', callback_data='spb11')
        spb12 = types.InlineKeyboardButton(text='Лесная', callback_data='spb12')
        spb13 = types.InlineKeyboardButton(text='Шушары', callback_data='spb13')
        spb14 = types.InlineKeyboardButton(text='(+)Лиговский проспект', callback_data='spb14')
        keyboard.add(spb1, spb2, spb3, spb4, spb5,spb6, spb7, spb8, spb9, spb10, spb11, spb12, spb13, spb14)
        question = 'Выберете подходящую станцию метро. Цена крыши 200 рублей.\n (+) - 300. (++) - 500.'
        bot.send_message(call.message.chat.id, question, reply_markup=keyboard)
    if call.data == "moscow":
        keyboard = types.InlineKeyboardMarkup()
        msc1 = types.InlineKeyboardButton(text='(++)Арбатская', callback_data='msc1')
        msc2 = types.InlineKeyboardButton(text='(+)Кузнетский мост', callback_data='mos')
        msc3 = types.InlineKeyboardButton(text='Беговая', callback_data='msc3')
        msc4 = types.InlineKeyboardButton(text='Марьино', callback_data='msc4')
        msc5 = types.InlineKeyboardButton(text='Арбатская', callback_data='msc5')
        msc6 = types.InlineKeyboardButton(text='ВДНХ', callback_data='msc6')
        msc7 = types.InlineKeyboardButton(text='Арбатская', callback_data='msc7')
        msc8 = types.InlineKeyboardButton(text='(+)Фрунзeнская', callback_data='mos1')
        msc9 = types.InlineKeyboardButton(text='Октябрьская', callback_data='mos2')
        msc10 = types.InlineKeyboardButton(text='Студенческая', callback_data='mos3')
        msc11 = types.InlineKeyboardButton(text='Молодежная', callback_data='mos4')
        msc12 = types.InlineKeyboardButton(text='Беговая', callback_data='mos5')
        msc13 = types.InlineKeyboardButton(text='Полежаевская', callback_data='mos6')
        keyboard.add(msc1, msc2, msc3, msc4, msc5, msc6, msc7, msc8, msc9, msc10, msc11, msc12, msc13)
        question = 'Подходящая станция метро.(+) - повышенная стоимость.'
        bot.send_message(call.message.chat.id, question, reply_markup=keyboard)
    if call.data == "check":
        status = p2p.check(bill_id=id).status
    # Проверка статуса оплаты
        if status == 'PAID': #Проверка, на то - дошла ли оплата до бота. Вслучае положительного ответа, он выполняет данный if.
            markup_finish = types.ReplyKeyboardMarkup(resize_keyboard=True)
            finish = types.KeyboardButton('/start')
            markup_finish.add(finish)
            bot.send_message(call.message.chat.id, text=f'✅ Оплата прошла!. Ваш адрес: №2 12-Я ЛИНИЯ В.О. Д. 33. ')
            bot.send_message(call.message.chat.id, '🤖 Чтобы создать новую заявку нажмите на кнопку /start.', reply_markup = markup_finish)
        else:
            bot.send_message(call.message.chat.id, text='🚫 Платеж не обнаружен, попробуйте нажать на кнопку проверки еще раз.')
    if call.data == "spb1" or call.data == "spb4" or call.data == "spb3" or call.data == "spb5" or call.data == "spb6" or call.data == "spb9" or call.data == "spb10" or call.data == "spb11" or call.data == "spb12" or call.data == "spb13" or call.data == "msc3" or call.data == "msc4" or call.data == "msc5" or call.data == "msc6" or call.data == "msc7" or call.data == "saint" or call.data == "saint1" or call.data == "mos" or call.data == "mos1" or call.data == "spb8" or call.data == "msc1" or call.data == "spb12" or call.data == "spb13" or call.data == "spb14" or call.data == "mos2" or call.data == "mos3" or call.data == "mos4" or call.data == "mos5" or call.data == "mos6":

        if call.data == "spb1":
            metro = "Старая деревня"
        if call.data == "spb3":
            metro = "Девяткино"
        if call.data == "spb4":
            metro = "Купчино"
        if call.data == "spb5":
            metro = "Комендантский проспект"
        if call.data == "spb6":
            metro = "Ладожская"
        if call.data == "spb9":
            metro = "Московская"
        if call.data == "spb10":
            metro = "Автово"
        if call.data == "spb11":
            metro = "Бухарестская"
        if call.data == "spb12":
            metro = "Лесная"
        if call.data == "spb13":
            metro = "Шушары"
        if call.data == "spb15":
            metro = "Лесная"
        if call.data == "msc3":
            metro = "Беговая"
        if call.data == "msc4":
            metro = "Марьино"
        if call.data == "msc5":
            metro = "Арбатская"
        if call.data == "msc6":
            metro = "ВДНХ"
        if call.data == "msc7":
            metro = "Арбатская"
        if call.data == "mos2":
            metro = "Октябрьская"
        if call.data == "mos3":
            metro = "Студенческая"
        if call.data == "mos4":
            metro = "Молодежная"
        if call.data == "mos5":
            metro = "Беговая"
        if call.data == "mos6":
            metro = "Полежаевская"
        price = 250
        if call.data == "saint":
            metro = "Садовая"
            price = 350
        if call.data == "saint1":
            metro = "Василеостровская"
            price = 350
        if call.data == "mos":
            metro = "Кузнетский мост"
            price = 350
        if call.data == "mos1":
            metro = "Фрунзенская"
            price = 350
        if call.data == "spb8":
            metro = "Адмиралтейская"
            price = 450
        if call.data == "msc1":
            metro = "Арбатская"
            price = 450
        if call.data == "spb14":
            metro = "Лиговский проспект"
            price = 300


        question = f'Цена: ' + price + ' рублей. Оплатить  👉 /pay 👈'
        message = bot.send_message(call.message.chat.id, question)
        bot.register_next_step_handler(message, buy, price, metro)







bot.infinity_polling()