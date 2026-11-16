# Exercícios — Python: lógica, estruturas e funções

## Q1 (fácil)

O que o código imprime?

```python
total = 0
for i in range(1, 6):
    if i % 2 == 0:
        continue
    total += i
print(total)
```

A) 9
B) 6
C) 15
D) 12
E) 5

## Q2 (média)

```python
d = {"SP": 1}
d["RJ"] += 2
```

Qual exceção é levantada?

A) `IndexError`
B) `TypeError`
C) `KeyError`
D) `ValueError`
E) `NameError`

## Q3 (difícil)

```python
a = [[1, 2], [3, 4]]
b = a[:]
b[0].append(5)
b.append([6])
print(a, len(b))
```

A) `[[1, 2], [3, 4]] 3`
B) `[[1, 2, 5], [3, 4]] 2`
C) `[[1, 2, 5], [3, 4], [6]] 3`
D) `[[1, 2], [3, 4]] 2`
E) `[[1, 2, 5], [3, 4]] 3`

