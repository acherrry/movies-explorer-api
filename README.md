# Бэкенд диплома *movies-explorer-api*

## О проекте
Данный репозиторий содержит бэкенд диплома Movies Explorer, выполненный в рамках обучения в [Яндекс Практикуме](https://practicum.yandex.ru/profile/web/). 
Возможности backend-приложения - регистрация и авторизация пользователя, операции с фильмами и пользователями.   
В проекте присутствуют две сущности: пользователи и фильмы. Созданы схемы, модели, контроллеры и роуты для каждой сущности.  
Реализована централизованная обработка ошибок, приходящие на сервер запросы валидируются, также валидируются данные на уровне схемы.  

### Роуты
Приложение корректно обрабатывает запросы по следующим роутам:
* `POST /signup` — регистрирует пользователя с переданными в теле запроса email, password и name,  
* `POST /signin` — авторизует пользователя - проверяет переданные в теле почту и пароль и возвращает JWT в cookies,  
* `DELETE /signout` — даёт возможность пользователю выйти из приложения, удаляет JWT из cookies.

Остальные роуты защищены авторизацией:
* `GET /users/me` — возвращает информацию о пользователе (email и имя),  
* `PATCH /users/me` — обновляет информацию о пользователе (email и имя),  
* `GET /movies` — возвращает все сохранённые текущим  пользователем фильмы,  
* `POST /movies` — создаёт фильм с переданными в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId,  
* `DELETE /movies/:movieId` — удаляет сохранённый фильм по id.

При попытке неавторизованного пользователя обратиться к защищённому маршруту возвращается 401 ошибка. 

### Статусы ошибок
В случаях, если при запросе что-то идет не так — возвращается соответствующий код ошибки:
* 400 — переданы некорректные данные и методы создания фильма, пользователя, обновления профиля пользователя;  
* 401 — передан неверный логин или пароль;  
* 403 — попытка удалить чужой фильм;   
* 404 — фильм или пользователь не найден;  
* 409 — при регистрации указан email, который уже существует на сервере;  
* 500 — ошибка по-умолчанию.  

### Используемые технологии
* Java Script (async/await; rest API),  
* Node.js,  
* MongoDB,  
* Express,  
* Celebrate,
* Validator,  
* Winston.  

## Ссылки
* [Критерии диплома веб-разработчика](https://code.s3.yandex.net/web-developer/static/new-program/web-diploma-criteria-2.0/index.html),   
* [Макет диплома](https://disk.yandex.ru/d/heDiGnuil8IWIg),  
* IP 62.84.116.155,  
* Frontend: https://movies-chernyadeva.nomoredomains.icu,  
* Backend: https://api.movies-chernyadeva.nomoredomains.icu.
