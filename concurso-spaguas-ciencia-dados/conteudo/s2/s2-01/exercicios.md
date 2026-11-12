# Exercícios — Python: lógica, estruturas e funções

## Q1 (fácil)

O que o código imprime?

```python
lista = [10, 20, 30, 40, 50]
print(lista[1:4:2], lista[-1])
```

A) `[20, 30, 40] 50`
B) `[20, 40] 50`
C) `[20, 40] 40`
D) `[10, 30] 50`
E) `[20, 30] 50`

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

