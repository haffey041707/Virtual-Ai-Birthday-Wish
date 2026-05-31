"""Project 1: Rule-Based AI Chatbot.

A simple terminal chatbot that uses predefined rules and if/elif/else logic.
"""


def normalize_text(text: str) -> str:
    """Lowercase and trim input for consistent matching."""
    return " ".join(text.lower().strip().split())


def is_exit_command(user_text: str) -> bool:
    """Return True if the user wants to end the chat."""
    if user_text == "bye":
        return True
    elif user_text == "exit":
        return True
    elif user_text == "quit":
        return True
    elif user_text == "goodbye":
        return True
    elif user_text == "see you":
        return True
    else:
        return False


def get_bot_response(user_text: str) -> str:
    """Return a chatbot response using rule-based if/elif/else logic."""
    if user_text == "hi" or user_text == "hello" or user_text == "hey":
        return "Hello! How can I help you today?"
    elif user_text == "good morning":
        return "Good morning! Hope your day starts great."
    elif user_text == "good afternoon":
        return "Good afternoon! What can I do for you?"
    elif user_text == "how are you":
        return "I am just code, but I am running perfectly. Thanks for asking!"
    elif user_text == "what is your name":
        return "I am RuleBot, your simple rule-based AI chatbot."
    elif user_text == "help":
        return "Try greeting me with hi/hello, ask my name, or type bye to exit."
    elif user_text == "thank you" or user_text == "thanks":
        return "You are welcome!"
    else:
        return "I do not understand that yet. Type 'help' to see what I can handle."


def main() -> None:
    print("=" * 56)
    print("RuleBot: Rule-Based AI Chatbot")
    print("Type a message and press Enter.")
    print("Type 'bye', 'exit', or 'quit' to end the chat.")
    print("=" * 56)

    while True:
        user_input = input("You: ")
        cleaned_input = normalize_text(user_input)

        if cleaned_input == "":
            print("RuleBot: Please type something so I can respond.")
            continue

        if is_exit_command(cleaned_input):
            print("RuleBot: Goodbye! It was nice chatting with you.")
            break

        reply = get_bot_response(cleaned_input)
        print(f"RuleBot: {reply}")


if __name__ == "__main__":
    main()
