class Card {
  constructor() {
    // 초기화: 빈 객체를 생성
    this.data = {
      blue: {
        pick: {},
        ban: {},
      },
      red: {
        pick: {},
        ban: {},
      },
    };
  }

  addBluePickCard(index, cardData) {
    this.data.blue.pick[index] = cardData;
  }

  addBlueBanCard(index, cardData) {
    this.data.blue.ban[index] = cardData;
  }

  addRedPickCard(index, cardData) {
    this.data.red.pick[index] = cardData;
  }

  addRedBanCard(index, cardData) {
    this.data.red.ban[index] = cardData;
  }
}

module.exports = Card;
