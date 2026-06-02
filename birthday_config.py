from __future__ import annotations


APP_CONFIG = {
    "birthdayName": "Aapi Jaan",
    "relation": "dearest sister",
}

BIRTHDAY_SEQUENCE = [
    {"text": "Happy Birthday, {name}", "revealName": True},
    {
        "text": (
            "Today is not just another date on the calendar. "
            "Today is the day my world received one of its brightest lights, and my heart "
            "received one of its greatest blessings."
        )
    },
    {
        "text": (
            "My {relation}, your smile has always felt like a soft sunrise after a long night. "
            "Your voice brings calm to my storms, your kindness heals hidden wounds, and your "
            "pure heart spreads warmth wherever you go."
        )
    },
    {
        "text": (
            "Every moment you believed in me when I doubted myself, every prayer you whispered "
            "for me quietly, and every time you stood beside me like a shield of love and loyalty "
            "means more to me than words can ever say."
        )
    },
    {
        "text": (
            "You are grace, you are strength, you are gentleness, and you are courage all in one soul. "
            "You carry love with dignity, and you carry pain with patience. That is what makes you truly beautiful."
        )
    },
    {
        "text": (
            "I pray that this year wraps you in peace, fills your days with laughter, and places ease "
            "in every path ahead of you. May your health stay strong, your heart stay light, and your dreams "
            "grow bigger every day."
        )
    },
    {
        "text": (
            "May Allah bless your life with barakah that never fades, rizq that keeps increasing, and joy "
            "that keeps multiplying. May every tear turn into relief, every fear turn into faith, and every "
            "delay turn into something better."
        )
    },
    {
        "text": (
            "You deserve gentle mornings, beautiful surprises, sincere people, and endless reasons to smile. "
            "You deserve a life where your effort is honored, your goodness is returned, and your pure intentions "
            "are rewarded beyond imagination."
        )
    },
    {
        "text": (
            "If love could be measured, mine for you would be endless. If prayers could be counted, mine for you "
            "would never stop. If gratitude had a voice, it would speak your name with respect, affection, and pride."
        )
    },
    {
        "text": (
            "You are not just family to me. You are my comfort place, my trusted person, my safe corner in this noisy "
            "world. You make ordinary days meaningful and hard days survivable, simply by being who you are."
        )
    },
    {
        "text": (
            "On your birthday, I want you to remember this forever: you are deeply loved, truly admired, and endlessly "
            "appreciated. Your presence is a gift, your heart is precious, and your story is written with honor."
        )
    },
    {
        "text": (
            "May this new year of your life bring success without stress, happiness without limits, and love without "
            "conditions. May doors open for you in the right places, at the right time, with the right blessings."
        )
    },
    {
        "text": (
            "I pray your smile stays bright, your soul stays peaceful, and your confidence stays unshakable. "
            "May every step you take lead you toward beauty, dignity, and fulfillment in both dunya and akhirah."
        )
    },
    {
        "text": (
            "And as always, my promise remains forever: I will celebrate you loudly, respect you deeply, stand by you "
            "faithfully, and keep praying for your happiness every single day. Happy birthday once again, {name}."
        )
    },
]

MIC_REPLIES = [
    {"pattern": "thank you|thanks", "reply": "Always. You deserve every bit of joy today."},
    {"pattern": "love you|i love you", "reply": "I love you too. Happy Birthday, star of the day."},
    {"pattern": "how are you|you there", "reply": "Online and celebrating. Standing by for your next command."},
]

CONFIG_PAYLOAD = {
    "appConfig": APP_CONFIG,
    "birthdaySequence": BIRTHDAY_SEQUENCE,
    "micReplies": MIC_REPLIES,
}
