#A caesarcipher is a symmetric substitution cipher - that shifts a letter by an integer place. Wrap around letters.
'''
BEGIN PlaceOfLetter(letter)
    FOR i = 0 to LENGTH(alphabet)
        IF alphabet[i] = letter
            RETURN i
        END IF
    END FOR
END FUNCTION

BEGIN
    SET alphabet = 'abcdefghijklmnopqrstuvwxyz'
    SET newmessage = ''
    INPUT message
    INPUT shift
    FOR letter in message
        IF letter = ' '
            newmessage = newmessage + letter
        ELSE
            SET currentplace = PlaceOfLetter(letter)
            SET newplace = (currentplace + shift)%26
            newmessage = newmessage + alphabet[newplace]
        END IF
    END FOR
    OUTPUT newmessage
END
'''

def PlaceOfLetter(letter):
    for i in range(len(alphabet)):
        if alphabet[i] == letter:
            return i
    return

alphabet = 'abcdefghijklmnopqrstuvwxyz'
newmessage = ''
message = input("What is your message: ")
shift = int(input("What is your shift? "))
for letter in message:
    if letter == " ":
        newmessage = newmessage + letter
    else:
        currentplace = PlaceOfLetter(letter)
        newplace = (currentplace + shift)%26
        newmessage = newmessage + alphabet[newplace]
print(newmessage)
