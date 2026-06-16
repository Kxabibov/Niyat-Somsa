export type Language = 'uz' | 'en' | 'ru';

export const translations = {
  uz: {
    nav: {
      home: 'Asosiy',
      about: 'Biz haqimizda',
      menu: 'Menyu',
      gallery: 'Galereya',
      location: 'Manzil',
      contact: 'Aloqa',
      admin: 'Admin',
    },
    hero: {
      title: 'Niyat Somsa - Haqiqiy Lazzat',
      subtitle: 'Anʼanaviy usulda, qoʻlda tayyorlangan lazzat',
      cta: 'Menyuni koʻrish',
    },
    special: {
      title: 'Bugungi Maxsus Somsa',
      subtitle: 'Eng sara masalliqlardan tayyorlangan',
    },
    about: {
      title: 'Bizning Hikoyamiz',
      content: 'Bizning novvoyxonamiz koʻp yillik anʼanalarga asoslangan. Har bir samsa mehr bilan, faqat tabiiy masalliqlardan foydalangan holda tayyorlanadi. Biz Oʻzbek madaniyati va mehmondoʻstligini har bir luqmada yetkazishga intilamiz.',
      content2: 'Srimiz tandirda — somsamizga betakror, tutunli taʼm va mukammal qarsildoq qobiq beradigan anʼanaviy loy oʻchoq. Har bir tishlam yangi va maza boʻlishi uchun goʻsht va sabzavotlarimizni mahalliy dehqonlardan olamiz.',
      stats: {
        years: 'Yillik anʼana',
        daily: 'Kunlik somsalar'
      },
      features: {
        handmade: {
          title: 'Qoʻlda yasalgan',
          desc: 'Har bir somsa qoʻlda bukiladi va tayyorlanadi, har bir tishlamda mukammal tuzilish va taʼmni taʼminlaydi.'
        },
        authentic: {
          title: 'Haqiqiy',
          desc: 'Biz avloddan avlodga oʻtib kelayotgan anʼanaviy oʻzbek retseptlaridan foydalanamiz va oʻziga xos taʼmni saqlab qolamiz.'
        },
        community: {
          title: 'Hamjamiyat',
          desc: 'Bizning novvoyxonamiz jamiyat toʻplanib, oʻzbek mehmondoʻstligi haroratidan bahramand boʻladigan joydir.'
        },
        fresh: {
          title: 'Kunlik yangi',
          desc: 'Biz kun davomida bir nechta partiyalarda pishiramiz, shuning uchun somsangiz har doim yangi va issiq boʻladi.'
        }
      },
      heritage: {
        title: 'Oʻzbek madaniyatini asrash',
        desc: 'Somsa Oʻzbekistonda shunchaki taom emas, u mehmondoʻstlik va anʼanalar ramzidir. Biz ushbu boy madaniy merosning bir qismi ekanligimizdan va uni siz bilan baham koʻrishdan faxrlanamiz.',
        natural: 'Tabiiy',
        tandir: 'Tandir',
        baked: 'Pishgan',
        halal: 'Halol',
        certified: 'Sertifikatlangan'
      }
    },
    menu: {
      title: 'Bizning Menyu',
      categories: {
        all: 'Hammasi',
        beef: 'Goʻshtli',
        chicken: 'Tovuqli',
        pumpkin: 'Oshqovoqli',
        greens: 'Koʻkatli',
      },
      search: 'Qidirish...',
      price: 'Narxi',
    },
    gallery: {
      title: 'Galereya',
      subtitle: 'Ish jarayonimizdan lavhalar',
      description: 'Novvoyxonamizdagi ish jarayonlari bilan tanishing va haqiqiy oʻzbek somsasini qanday tayyorlashimizni koʻring.',
    },
    location: {
      title: 'Bizning Manzil',
      address: 'Toshkent sh., Amir Temur koʻchasi, 10-uy',
      hours: 'Ish vaqti: 08:00 - 20:00',
      directions: 'Moʻljal: Markaziy xiyobon yaqinida',
      subtitle: 'Toshkentdagi markaziy novvoyxonamizga tashrif buyuring va bevosita tandirdan chiqqan oʻzbek somsasining haqiqiy taʼmidan bahramand boʻling.',
      openMaps: 'Xaritada ochish',
      addressTitle: 'Manzil',
      workingHoursTitle: 'Ish vaqti',
      weekdays: 'Dushanba - Juma',
      weekends: 'Shanba - Yakshanba',
      contactTitle: 'Aloqa',
      getDirections: 'Yoʻnalish olish'
    },
    contact: {
      title: 'Biz bilan bogʻlaning',
      subtitle: 'Savolingiz bormi yoki tadbir uchun buyurtma bermoqchimisiz? Bizga xabar yuboring va tez orada siz bilan bogʻlanamiz.',
      name: 'Ismingiz',
      message: 'Xabaringiz',
      send: 'Yuborish',
      success: 'Xabaringiz muvaffaqiyatli yuborildi!',
      thankYou: 'Rahmat!',
      sendAnother: 'Yana xabar yuborish',
      getInTouch: 'Bogʻlanish',
      touchSubtitle: 'Sizdan eshitishdan doim xursandmiz. Menyuga oid savolingiz boʻladimi, katta buyurtma bermoqchimisiz yoki shunchaki salom aytmoqchimisiz, biz bilan bogʻlaning.',
      phoneLabel: 'Telefon',
      emailLabel: 'Elektron pochta',
      locationLabel: 'Manzil',
      followUs: 'Bizni kuzatib boring'
    },
    admin: {
      login: 'Kirish',
      logout: 'Chiqish',
      add: 'Qoʻshish',
      edit: 'Tahrirlash',
      delete: 'Oʻchirish',
      save: 'Saqlash',
      cancel: 'Bekor qilish',
    },
    footer: {
      pages: 'Sahifalar',
      socials: 'Ijtimoiy tarmoqlar',
      rights: 'Niyat Somsa. Barcha huquqlar himoyalangan.',
      everyday: 'har kun'
    },
    home: {
      popular: 'Mashhur tanlovlar',
      viewAll: 'Hammasini koʻrish',
      reviews: 'baholar',
      features: {
        taste: 'Haqiqiy taʼm',
        recipe: 'Avloddan avlodga oʻtgan anʼanaviy retseptlar.',
        everyday: 'Har kun'
      },
      viewButton: 'Koʻrish',
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      menu: 'Menu',
      gallery: 'Gallery',
      location: 'Location',
      contact: 'Contact',
      admin: 'Admin',
    },
    hero: {
      title: 'Niyat Somsa - Authentic Taste',
      subtitle: 'Handmade flavor with traditional methods',
      cta: 'View Menu',
    },
    special: {
      title: "Today's Special Somsa",
      subtitle: 'Prepared from the finest ingredients',
    },
    about: {
      title: 'Our Story',
      content: 'Our bakery is based on years of tradition. Each samsa is prepared with love, using only natural ingredients. We strive to convey Uzbek culture and hospitality in every bite.',
      content2: 'Our secret lies in the tandir—a traditional clay oven that gives our samsa its unique, smoky flavor and perfectly crispy crust. We source our meat and vegetables from local farmers to ensure every bite is as fresh as it is delicious.',
      stats: {
        years: 'Years of Tradition',
        daily: 'Somsas Daily'
      },
      features: {
        handmade: {
          title: 'Handmade',
          desc: 'Every single samsa is folded and prepared by hand, ensuring the perfect texture and flavor in every bite.'
        },
        authentic: {
          title: 'Authentic',
          desc: 'We use traditional Uzbek recipes passed down through generations, keeping the authentic taste alive.'
        },
        community: {
          title: 'Community',
          desc: 'Our bakery is a place for the community to gather and enjoy the warmth of Uzbek hospitality.'
        },
        fresh: {
          title: 'Fresh Daily',
          desc: 'We bake multiple batches throughout the day, so you always get your samsa fresh and hot.'
        }
      },
      heritage: {
        title: 'Preserving Uzbek Heritage',
        desc: "Somsa is more than just food in Uzbekistan; it's a symbol of hospitality and tradition. We take pride in being a part of this rich cultural heritage and sharing it with you.",
        natural: 'Natural',
        tandir: 'Tandir',
        baked: 'Baked',
        halal: 'Halal',
        certified: 'Certified'
      }
    },
    menu: {
      title: 'Our Menu',
      categories: {
        all: 'All',
        beef: 'Beef',
        chicken: 'Chicken',
        pumpkin: 'Pumpkin',
        greens: 'Greens',
      },
      search: 'Search...',
      price: 'Price',
    },
    gallery: {
      title: 'Gallery',
      subtitle: 'Moments from our daily work',
      description: 'Take a peek behind the scenes of our bakery and see how we create the most authentic Uzbek samsa.',
    },
    location: {
      title: 'Our Location',
      address: '10 Amir Temur St, Tashkent',
      hours: 'Working hours: 08:00 - 20:00',
      directions: 'Landmark: Near the Central Square',
      subtitle: 'Visit us at our central bakery in Tashkent and experience the authentic taste of Uzbek samsa fresh from the tandir.',
      openMaps: 'Open in Maps',
      addressTitle: 'Address',
      workingHoursTitle: 'Working Hours',
      weekdays: 'Monday - Friday',
      weekends: 'Saturday - Sunday',
      contactTitle: 'Contact',
      getDirections: 'Get Directions'
    },
    contact: {
      title: 'Contact Us',
      subtitle: "Have a question or want to order for an event? Send us a message and we'll get back to you as soon as possible.",
      name: 'Your Name',
      message: 'Your Message',
      send: 'Send',
      success: 'Your message has been sent successfully!',
      thankYou: 'Thank You!',
      sendAnother: 'Send another message',
      getInTouch: 'Get in Touch',
      touchSubtitle: "We're always happy to hear from you. Whether you have a question about our menu, want to place a large order, or just want to say hello, feel free to reach out.",
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      locationLabel: 'Location',
      followUs: 'Follow Us'
    },
    admin: {
      login: 'Login',
      logout: 'Logout',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
    },
    footer: {
      pages: 'Pages',
      socials: 'Social Networks',
      rights: 'Niyat Somsa. All rights reserved.',
      everyday: 'everyday'
    },
    home: {
      popular: 'Popular Choices',
      viewAll: 'View All',
      reviews: 'reviews',
      features: {
        taste: 'Authentic Taste',
        recipe: 'Traditional recipes passed down from generation to generation.',
        everyday: 'Everyday'
      },
      viewButton: 'View',
    }
  },
  ru: {
    nav: {
      home: 'Главная',
      about: 'О нас',
      menu: 'Меню',
      gallery: 'Галерея',
      location: 'Локация',
      contact: 'Контакты',
      admin: 'Админ',
    },
    hero: {
      title: 'Niyat Somsa - Настоящий Вкус',
      subtitle: 'Вкус ручной работы по традиционным методам',
      cta: 'Посмотреть меню',
    },
    special: {
      title: 'Сегодняшняя особенная самса',
      subtitle: 'Приготовлено из лучших ингредиентов',
    },
    about: {
      title: 'Наша история',
      content: 'Наша пекарня основана на многолетних традициях. Каждая самса готовится с любовью, с использованием только натуральных ингредиентов. Мы стремимся передать узбекскую культуру и гостеприимство в каждом кусочке.',
      content2: 'Наш секрет в тандыре — традиционной глиняной печи, которая придает нашей самсе уникальный дымный вкус и хрустящую корочку. Мясо и овощи мы берем у местных фермеров.',
      stats: {
        years: 'Лет Традиций',
        daily: 'Самсы Ежедневно'
      },
      features: {
        handmade: {
          title: 'Ручная работа',
          desc: 'Каждая самса лепится и готовится вручную, обеспечивая идеальную текстуру и вкус в каждом кусочке.'
        },
        authentic: {
          title: 'Аутентичность',
          desc: 'Мы используем традиционные узбекские рецепты, передаваемые из поколения в поколение.'
        },
        community: {
          title: 'Сообщество',
          desc: 'Наша пекарня — это место, где сообщество может собраться и насладиться теплотой узбекского гостеприимства.'
        },
        fresh: {
          title: 'Свежее каждый день',
          desc: 'Мы выпекаем несколько партий в течение дня, поэтому вы всегда получаете свежую и горячую самсу.'
        }
      },
      heritage: {
        title: 'Сохранение Узбекского Наследия',
        desc: 'Самса в Узбекистане — это больше, чем просто еда; это символ гостеприимства и традиций. Мы гордимся тем, что являемся частью этого богатого культурного наследия.',
        natural: 'Натурально',
        tandir: 'Тандыр',
        baked: 'Выпечка',
        halal: 'Халяль',
        certified: 'Сертифицировано'
      }
    },
    menu: {
      title: 'Наше меню',
      categories: {
        all: 'Все',
        beef: 'С говядиной',
        chicken: 'С курицей',
        pumpkin: 'С тыквой',
        greens: 'С зеленью',
      },
      search: 'Поиск...',
      price: 'Цена',
    },
    gallery: {
      title: 'Галерея',
      subtitle: 'Моменты из нашей повседневной работы',
      description: 'Загляните за кулисы нашей пекарни и посмотрите, как мы создаем самую настоящую узбекскую самсу.',
    },
    location: {
      title: 'Наше местоположение',
      address: 'Ташкент, ул. Амира Темура, 10',
      hours: 'Часы работы: 08:00 - 20:00',
      directions: 'Ориентир: Рядом с Центральным сквером',
      subtitle: 'Посетите нашу центральную пекарню в Ташкенте и попробуйте настоящий вкус узбекской самсы прямо из тандыра.',
      openMaps: 'Открыть на карте',
      addressTitle: 'Адрес',
      workingHoursTitle: 'Часы работы',
      weekdays: 'Понедельник - Пятница',
      weekends: 'Суббота - Воскресенье',
      contactTitle: 'Контакты',
      getDirections: 'Проложить маршрут'
    },
    contact: {
      title: 'Свяжитесь с нами',
      subtitle: 'У вас есть вопрос или хотите сделать крупный заказ? Отправьте нам сообщение, и мы свяжемся с вами в ближайшее время.',
      name: 'Ваше имя',
      message: 'Ваше сообщение',
      send: 'Отправить',
      success: 'Ваше сообщение успешно отправлено!',
      thankYou: 'Спасибо!',
      sendAnother: 'Отправить еще одно сообщение',
      getInTouch: 'Связаться с нами',
      touchSubtitle: 'Мы всегда рады вашим сообщениям. Будь то вопрос о меню, большой заказ или вы просто хотите сказать привет.',
      phoneLabel: 'Телефон',
      emailLabel: 'Email',
      locationLabel: 'Локация',
      followUs: 'Следите за нами'
    },
    admin: {
      login: 'Вход',
      logout: 'Выход',
      add: 'Добавить',
      edit: 'Изменить',
      delete: 'Удалить',
      save: 'Сохранить',
      cancel: 'Отмена',
    },
    footer: {
      pages: 'Страницы',
      socials: 'Социальные сети',
      rights: 'Niyat Somsa. Все права защищены.',
      everyday: 'каждый день'
    },
    home: {
      popular: 'Популярные блюда',
      viewAll: 'Посмотреть все',
      reviews: 'оценок',
      features: {
        taste: 'Настоящий вкус',
        recipe: 'Традиционные рецепты, передаваемые из поколения в поколение.',
        everyday: 'Каждый день'
      },
      viewButton: 'Посмотреть',
    }
  }
};
