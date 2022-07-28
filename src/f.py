import math


def is_prime(n):
    if (n <= 1):
        return False
    if (n <= 3):
        return True
    if (n % 2 == 0 or n % 3 == 0):
        return False
    i = 5
    while(i * i <= n):
        if (n % i == 0 or n % (i + 2) == 0):
            return False
        i = i + 6
    return True


def is_Tprime(n):
    if math.sqrt(n) % 1 == 0 and is_prime(math.sqrt(n)):
        print("YES")
    else:
        print("NO")


z = int(input())
q = list(map(int, input().split(" ")))

for i in range(len(q)):
    is_Tprime(q[i])
