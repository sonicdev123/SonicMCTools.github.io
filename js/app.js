// Just enter your server name //
const serverName = 'LunaMC'
// Just enter your server name //


// Main data
const serverNameTitle = document.getElementById('server-name-title')
const serverIcon = document.getElementById('server-icon')
const serverLogo = document.getElementById('server-brand-logo')
const serverNameBrand = document.getElementById('server-name-brand')
const serverIp = document.getElementById('server-ip')
const serverVote = document.getElementById('vote-count')
const serverStatus = document.getElementById('server-status')
const serverPlayer = document.getElementById('server-player')
const serverTopPlayer = document.getElementById('server-top-player')
const serverUptimeDowntime = document.getElementById('server-uptime-downtime')
const serverPing = document.getElementById('server-ping')
const serverLocation = document.getElementById('server-location')
const discordItem = document.getElementById('discord-item')
const discordLink = document.getElementById('discord-link')
const telegramItem = document.getElementById('telegram-item')
const telegramLink = document.getElementById('telegram-link')
const instagramItem = document.getElementById('instagram-item')
const instagramLink = document.getElementById('instagram-link')
const serverNameMain = document.getElementById('server-name-main')
const serverPlayerMain = document.getElementById('server-player-main')
const serverBanner = document.getElementById('server-banner')
const voterBox = document.getElementById('voter-box')
const gamemodeBox = document.getElementById('gamemode-box')
const announceText = document.getElementById('announce-text')
const updateText = document.getElementById('update-text')
const staffBox = document.getElementById('staff-box')
const loading = document.getElementById('loading')
const loadingMessage = document.getElementById('loading-message')

let tempData = {
    vote_list: _.range(_.random(0, 1000)),
    staff_list: _.range(_.random(0, 1000)),
}

const init = () => {
    setTimeout(() => {
        TooltipRefresh()

        run()
        setInterval(run, 30000)
    }, 2000)
}

const run = () => {
    $.ajax(`https://mctools.ir/api/v1/servers/${serverName}/`, {
        type: 'GET',
        dataType: 'json',
        timeout: 5000,
        success,
        error
    })
}

const success = data => {
    if (!data['error']) {

        document.documentElement.style.setProperty('--color2', data['color'])
        $(serverNameTitle).text(data['name'])
        $(serverNameMain).text(data['name'])
        $(serverNameBrand).text(data['name'])
        $(serverIcon).attr('href', data['icon'] || 'img/logo.png')
        $(serverLogo).attr('src', data['icon'] || 'img/logo.png')
        data['banner'] ? $(serverBanner).attr('src', data['banner']) : $(serverBanner).hide()
        $(serverIp).text(data['ip'])
        $(serverVote).text(data['vote'])
        $(serverIp).on('click', () => copy(data['ip']))
        $(serverPlayerMain).text(data['player'] !== -1 ? `${data['player']}/${data['max_player']}` : 'Offline')
        $(serverPlayer).attr('title', data['player'] !== -1 ? `${data['player']}/${data['max_player']} پلیر های انلاین ` : ' سرور در حال حاضر افلاین است !')
        $(serverStatus).text(data['player'] !== -1 ? 'Online' : 'Offline')
        $(serverStatus).addClass(data['player'] !== -1 ? 'status-online' : 'status-offline')
        $(serverTopPlayer).attr('title', ` ${data['top_player']} رکورد بیشترین پلیر انلاین `)
        $(serverUptimeDowntime).attr('title', data['uptime'] !== 0 ? `${GetUDTimeString(data['uptime'])} زمان انلاین بودن ` : ` ${GetUDTimeString(data['downtime'])} زمان افلاین بودن `)
        $(serverPing).attr('title', data['ping'] ? `${data['ping']} ms پینگ` : 'سرور افلاین است')
        $(serverLocation).attr('title', `${data['location_en']}  مکان `)

        if (data['discord'] !== 'Un-defined') {
            $(discordLink).attr('href', `https://${data['discord']}`)
            $(discordItem).removeClass('d-none')
        }

        if (data['telegram'] !== 'Un-defined') {
            $(telegramLink).attr('href', `https://t.me/${data['telegram'].replace("@", "")}`)
            $(telegramItem).removeClass('d-none')
        }

        if (data['instagram'] !== 'Un-defined') {
            $(instagramLink).attr('href', `https://instagram.com/${data['instagram']}`)
            $(instagramItem).removeClass('d-none')
        }

        $(announceText).empty()
        if (data['last_announce']) {
            if (data['last_announce'].length > 3) {
                $(announceText).html(data['last_announce'])
            } else {
                $(announceText).html(`
                هیچ Announce یافت نشد
                <i class="fa-solid fa-bell"></i>
            `)
            }
        } else {
            $(announceText).html(`
                هیچ Announce یافت نشد
                <i class="fa-solid fa-bell"></i>
            `)
        }

        $(updateText).empty()
        if (data['last_update']) {
            if (data['last_update'].length > 3) {
                $(updateText).html(data['last_update'])
            } else {
                $(updateText).html(`
                هیچ Update یافت نشد
                <i class="fa-solid fa-bell"></i>
            `)
            }
        } else {
            $(updateText).html(`
                هیچ Update یافت نشد
                <i class="fa-solid fa-bell"></i>
            `)
        }

        if (!(_.isEqual(data['vote_list'], [...tempData['vote_list']])) &&
            data['vote_list'].length !== [...tempData['vote_list']].length) {
            $(voterBox).empty()
            if (data['vote_list'].length > 0) {
                data['vote_list'].map((vote, index) => {
                    $(voterBox).append(`
                    <ul>
                        <li>
                            <a href="${vote['discord_avatar'] || 'img/default-avatar.png'}" data-lightbox="${index}_voter">
                                <img src="${vote['discord_avatar']}"
                                     id="${index}_voter" 
                                     alt="${vote['username']}" 
                                     onerror="this.src='img/default-avatar.png'"
                                >
                            </a>
                            <div>
                                <p>
                                    <i class="fa-solid fa-user-pen"></i>
                                    ${vote['username']}
                                </p>
                                <p onclick="copy('${vote['discord_tag']}')">
                                    <i class="fa-solid fa-copy"></i>
                                     کپی دیسکورد تگ
                                </p>
                            </div>
                        </li>
                        <li>
                            <p>${data['vote_list'].length - index}</p>
                        </li>
                    </ul>
                `)
                })
            } else {
                $(voterBox).html(`
                <p class="not-found">
                    <i class="fa-solid fa-bell"></i>
                    شخصی به این سرور رای نداده
                </p>
            `)
            }
        }

        $(gamemodeBox).empty()
        if (data['gamemode_list'].length > 0) {
            data['gamemode_list'].map(gamemode => {
                $(gamemodeBox).append(`
                    <ul class="col">
                        <li>
                            <i class="fa-solid fa-dice-six"></i>
                            <p>
                                ${gamemode['name']}
                            </p>
                        </li>
                        <li>
                            <i class="fa-solid fa-user"></i>
                            <p>
                                ${gamemode['player']}
                            </p>
                        </li>
                    </ul>
                `)
            })
        } else {
            $(gamemodeBox).html(`
                <p class="not-found">
                    <i class="fa-solid fa-bell"></i>
                    هیج گیم مودی ثبت نشده
                </p>
            `)
        }

        if (!_.isEqual(data['staff_list'], [...tempData['staff_list']])) {
            $(staffBox).empty()
            if (data['staff_list'].length > 0) {
                data['staff_list'].map((staff, index) => {
                    $(staffBox).append(`
                    <ul>
                        <li>
                            <a href="${staff['discord_avatar'] || 'img/default-avatar.png'}" data-lightbox="${index}_staff">
                                <img src="${staff['discord_avatar']}"
                                     onerror="this.src = 'img/default-avatar.png'"
                                     alt="${staff['username']}"
                                     id="${index}_staff"
                                     style="border-color: var(--${staff['rank'].toLowerCase()})"
                                >
                            </a>
                            <div>
                                <p>
                                    <i class="fa-solid fa-user-tie"></i>
                                    ${staff['username']}
                                </p>
                                <p style="color: var(--${staff['rank'].toLowerCase()})">
                                    <i class="fa-solid fa-address-card"></i>
                                    ${staff['rank']}
                                </p>
                            </div>
                        </li>
                        <li>
                            <i onclick="copy('${staff['username']}#${staff['discord_tag']}')" 
                               class="fa-solid fa-copy"
                               data-bs-toggle="tooltip"
                               data-bs-placement="left"
                               title="برای کپی کردن تگ دیسکورد کلیک کنید"
                               >
                            </i>
                        </li>
                    </ul>
                `)
                })
            } else {
                $(staffBox).html(`
                <p class="not-found">
                    <i class="fa-solid fa-bell"></i>
                    استف ثبت شده ای وجود ندارد
                </p>
            `)
            }
        }

        $(loading).fadeOut()
        $('*').tooltip('hide');
        TooltipRefresh()
        tempData = {...data}
    } else {
        error()
    }
}

const error = (none, message) => {
    $(loading).fadeIn()
    $(loadingMessage).html(`
        <i class="fa-solid fa-bell"></i>
        Something went wrong please wait... 
        (${message})
    `)
    run()
}

const TooltipRefresh = () => {
    [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map(
        (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    )
}

const copy = async data => {
    await navigator.clipboard.writeText(data)
    Snackbar.show({
        text: `Copy (${data}) successfully`,
        pos: "bottom-right",
        customClass: "custom-snake",
        showAction: false
    })
}

const GetUDTimeString = minutesParam => {
    let duration = moment.duration(minutesParam, 'minutes');
    let years = duration.years(), months = duration.months(), minutes = duration.minutes(), hours = duration.hours(),
        days = duration.days();
    let str = '';

    if (years !== 0) {
        str += years + ' year';
        if (years > 1) str += 's';
    }
    if (months !== 0) {
        if (years !== 0) str += ', ';
        str += months + ' month';
        if (months > 1) str += 's';
    }
    if (days !== 0) {
        if (months !== 0) str += ', ';
        str += days + ' day';
        if (days > 1) str += 's';
    }
    if (hours !== 0) {
        if (days !== 0) str += ', ';
        str += hours + ' hr';
        if (hours > 1) str += 's';
    }
    if (hours !== 0 || days !== 0) str += ', ';
    str += minutes + ' min';
    if (minutes > 1) str += 's';

    return str;
}

init()
