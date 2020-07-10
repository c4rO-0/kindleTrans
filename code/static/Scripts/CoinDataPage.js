function showBar(data) {
    let p_close = data.marketInfo.kline.close
    let p_av_up = data.marketInfo.p_average_up
    let p_av_dn = data.marketInfo.p_average_dn


    let p_buy_hook_high = data.unprocHookInfo.p_buy_high
    let p_buy_hook_low = data.unprocHookInfo.p_buy_low

    let p_sell_hook_high = data.unprocHookInfo.p_sell_high
    let p_sell_hook_low = data.unprocHookInfo.p_sell_low

    let p_buy_nail_high = null
    let p_buy_nail_low = null
    if (data.unprocNailInfo.n_buy + data.cutNailInfo.n_buy > 0) {
        p_buy_nail_high = Math.max(
            data.unprocNailInfo.p_buy_high == null ? -1. : data.unprocNailInfo.p_buy_high,
            data.cutNailInfo.p_buy_high == null ? -1. : data.cutNailInfo.p_buy_high)


        p_buy_nail_low = Math.min(
            data.unprocNailInfo.p_buy_low == null ? 1.E8 : data.unprocNailInfo.p_buy_low,
            data.cutNailInfo.p_buy_low == null ? 1.E8 : data.cutNailInfo.p_buy_low)
    }


    let p_sell_nail_low = null
    let p_sell_nail_high = null
    if (data.unprocNailInfo.n_sell + data.cutNailInfo.n_sell > 0) {

        p_sell_nail_low = Math.min(
            data.unprocNailInfo.p_sell_low == null ? 1.E8 : data.unprocNailInfo.p_sell_low,
            data.cutNailInfo.p_sell_low == null ? 1.E8 : data.cutNailInfo.p_sell_low)

        p_sell_nail_high = Math.max(
            data.unprocNailInfo.p_sell_high == null ? -1. : data.unprocNailInfo.p_sell_high,
            data.cutNailInfo.p_sell_high == null ? -1. : data.cutNailInfo.p_sell_high)
    }


    let p_min = Math.min(p_close,
        p_av_up == null ? 1.E8 : p_av_up,
        p_av_dn == null ? 1.E8 : p_av_dn,
        p_buy_hook_low == null ? 1.E8 : p_buy_hook_low,
        p_buy_nail_low == null ? 1.E8 : p_buy_nail_low,
        p_buy_hook_high == null ? 1.E8 : p_buy_hook_high,
        p_buy_nail_high == null ? 1.E8 : p_buy_nail_high,
        p_sell_hook_low == null ? 1.E8 : p_sell_hook_low,
        p_sell_nail_low == null ? 1.E8 : p_sell_nail_low,
        p_sell_hook_high == null ? 1.E8 : p_sell_hook_high,
        p_sell_nail_high == null ? 1.E8 : p_sell_nail_high,
    )

    let p_max = Math.max(
        p_av_up == null ? -1. : p_av_up,
        p_av_dn == null ? -1. : p_av_dn,
        p_buy_hook_low == null ? -1. : p_buy_hook_low,
        p_buy_nail_low == null ? -1. : p_buy_nail_low,
        p_buy_hook_high == null ? -1. : p_buy_hook_high,
        p_buy_nail_high == null ? -1. : p_buy_nail_high,
        p_sell_hook_low == null ? -1. : p_sell_hook_low,
        p_sell_nail_low == null ? -1. : p_sell_nail_low,
        p_sell_hook_high == null ? -1. : p_sell_hook_high,
        p_sell_nail_high == null ? -1. : p_sell_nail_high,
    )

    let p_lRange = p_close - p_min
    let p_rRange = p_max - p_close
    let p_maxRange = Math.max(p_lRange, p_rRange)

    // cal the distance to p_close

    $('#price .card-header').text(p_close.toFixed(6))


    n_max = Math.ceil(data.marketInfo.balance.n_eth_eff)

    n_eff = data.marketInfo.balance.n_eth_eff
    n_eth_f = data.marketInfo.balance.n_eth_f
    n_eth_t = data.marketInfo.balance.n_eth_t
    n_eth = n_eth_f + n_eth_t
    $('#n-eff-prg .progress-bar:eq(0)').css('width', n_eth_f / n_max * 100. + '%')
    $('#n-eff-prg .progress-bar:eq(0)').text(n_eth_f.toFixed(6))
    $('#n-eff-prg .progress-bar:eq(1)').css('width', n_eth_t / n_max * 100. + '%')
    $('#n-eff-prg .progress-bar:eq(1)').text(n_eth_t.toFixed(6))


    n_btc2eth = n_eff - n_eth
    n_btc = data.marketInfo.balance.n_btc_t + data.marketInfo.balance.n_btc_f
    n_btc2eth_t = n_btc2eth * data.marketInfo.balance.n_btc_t / n_btc
    n_btc2eth_f = n_btc2eth * data.marketInfo.balance.n_btc_f / n_btc

    $('#n-eff-prg .progress-bar:eq(2)').css('width', (n_btc2eth_f / n_max * 100.) + '%')
    $('#n-eff-prg .progress-bar:eq(2)').text(n_btc2eth_f.toFixed(6))
    $('#n-eff-prg .progress-bar:eq(3)').css('width', (n_btc2eth_t / n_max * 100.) + '%')
    $('#n-eff-prg .progress-bar:eq(3)').text(n_btc2eth_t.toFixed(6))


    $('#n-eff-prg .progress-bar:eq(4)').css('width', (100. - n_eff / n_max * 100.) + '%')
    $('#n-eff-prg .progress-bar:eq(4)').text((n_max - n_eff).toFixed(6))

    $('#n-eff').text(n_eff.toFixed(4))



    $('#hook-order-filled').text(data.filledHookOrderInfo.n_buy + '+' + data.filledHookOrderInfo.n_sell)

    strTime = data.lastHookOrder.toFixed(1) + 'm'
    if (data.lastHookOrder > 60.) {
        strTime = (data.lastHookOrder / 60.).toFixed(1) + 'h'
    }
    if (data.lastHookOrder > 60. * 24) {
        strTime = (data.lastHookOrder / 60. / 24.).toFixed(1) + 'd'
    }

    $('#hook-order-last').text(strTime)

    $('#nail-order-filled').text(data.filledNailOrderInfo.n_buy + '+' + data.filledNailOrderInfo.n_sell)

    strTime = data.lastNailOrder.toFixed(1) + 'm'
    if (data.lastNailOrder > 60.) {
        strTime = (data.lastNailOrder / 60.).toFixed(1) + 'h'
    }
    if (data.lastNailOrder > 60. * 24) {
        strTime = (data.lastNailOrder / 60. / 24.).toFixed(1) + 'd'
    }

    $('#nail-order-last').text(strTime)

    if (data.unprocHookInfo.n_buy) {
        $('#p-hook-left .progress-bar:eq(0)').css('width', (p_close - p_buy_hook_high) / p_maxRange * 100. + '%')
        $('#p-hook-left .progress-bar:eq(1)').css('width', (p_buy_hook_high - p_buy_hook_low) / p_maxRange * 100. + '%')

        $('#p-hook-left .card-text').text(data.unprocHookInfo.n_buy + ' | ' + (p_buy_hook_high).toFixed(6))
    } else {
        $('#p-hook-left .progress-bar').css('width', '0%')
        $('#p-hook-left .card-text').text(data.unprocHookInfo.n_buy + ' | None')
    }

    if (data.unprocHookInfo.n_sell) {
        $('#p-hook-right .progress-bar:eq(0)').css('width', (p_sell_hook_low - p_close) / p_maxRange * 100. + '%')
        $('#p-hook-right .progress-bar:eq(1)').css('width', (p_sell_hook_high - p_sell_hook_low) / p_maxRange * 100. + '%')

        $('#p-hook-right .card-text').text((p_sell_hook_low).toFixed(6) + ' | ' + data.unprocHookInfo.n_sell)

    } else {
        $('#p-hook-right .progress-bar').css('width', '0%')
        $('#p-hook-right .card-text').text('None | ' + data.unprocHookInfo.n_sell)
    }

    n_nail_buy = data.unprocNailInfo.n_buy + data.cutNailInfo.n_buy
    if (n_nail_buy) {
        $('#p-nail-left .progress-bar:eq(0)').css('width', (p_close - p_buy_nail_high) / p_maxRange * 100. + '%')
        $('#p-nail-left .progress-bar:eq(1)').css('width', (p_buy_nail_high - p_buy_nail_low) / p_maxRange * 100. + '%')

        $('#p-nail-left .card-text').text(n_nail_buy + ' | ' + (p_buy_nail_high).toFixed(6))

    } else {
        $('#p-nail-left .progress-bar').css('width', '0%')
        $('#p-nail-left .card-text').text(n_nail_buy + ' | None')
    }

    n_nail_sell = data.unprocNailInfo.n_sell + data.cutNailInfo.n_sell
    if (n_nail_sell) {

        $('#p-nail-right .progress-bar:eq(0)').css('width', (p_sell_nail_low - p_close) / p_maxRange * 100. + '%')
        $('#p-nail-right .progress-bar:eq(1)').css('width', (p_sell_nail_high - p_sell_nail_low) / p_maxRange * 100. + '%')

        $('#p-nail-right .card-text').text((p_sell_nail_low).toFixed(6) + ' | ' + n_nail_sell)

    } else {
        $('#p-nail-right .progress-bar').css('width', '0%')
        $('#p-nail-right .card-text').text('None | ' + n_nail_sell)
    }

    // if(p_av_dn){
    //     $('#p-av-left .progress-bar').css('width', (p_close - p_av_dn)/p_maxRange*100. + '%')
    //     $('#p-av-left .card-text').text('-'+(p_close - p_av_dn).toFixed(6) )        
    // }else{
    //     $('#p-av-left .progress-bar').css('width', '0%')
    //     $('#p-av-left .card-text').text('None' )   
    // }

    // if(p_av_up){
    //     $('#p-av-right .progress-bar').css('width', (p_av_up - p_close )/p_maxRange*100. + '%')
    //     $('#p-av-right .card-text').text('+'+(p_av_up - p_close).toFixed(6) )  
    // }else{
    //     $('#p-av-right .progress-bar').css('width', '0%')
    //     $('#p-av-right .card-text').text('None' )   
    // }

    // console.log(data.unprocNailInfo.n_buy, data.config)
    $('#buy-limit .progress-bar').css('width', (n_nail_buy) / (data.config.n_buy_limit_stop_sell) * 100. + '%')
    if (n_nail_buy >= data.config.n_buy_limit_stop_sell) {
        $('#buy-limit .progress-bar').removeClass('bg-danger', 'bg-warning', 'bg-success')
        $('#buy-limit .progress-bar').addClass('bg-danger')
    } else if (n_nail_buy >= 0.6 * data.config.n_buy_limit_stop_sell) {
        $('#buy-limit .progress-bar').removeClass('bg-danger', 'bg-warning', 'bg-success')
        $('#buy-limit .progress-bar').addClass('bg-warning')
    } else {
        $('#buy-limit .progress-bar').removeClass('bg-danger', 'bg-warning', 'bg-success')
        $('#buy-limit .progress-bar').addClass('bg-success')
    }


    $('#sell-limit .progress-bar').css('width', (n_nail_sell) / (data.config.n_sell_limit_stop_buy) * 100. + '%')
    if (n_nail_sell >= data.config.n_sell_limit_stop_buy) {
        $('#buy-limit .progress-bar').removeClass('bg-danger', 'bg-warning', 'bg-success')
        $('#buy-limit .progress-bar').addClass('bg-danger')
    } else if (n_nail_sell >= 0.6 * data.config.n_sell_limit_stop_buy) {
        $('#buy-limit .progress-bar').removeClass('bg-danger', 'bg-warning', 'bg-success')
        $('#buy-limit .progress-bar').addClass('bg-warning')
    } else {
        $('#buy-limit .progress-bar').removeClass('bg-danger', 'bg-warning', 'bg-success')
        $('#buy-limit .progress-bar').addClass('bg-success')
    }

}

function runStatus(data) {

    running = Math.abs(Date.now() / 1000. - data.time) <= 6. * 60

    if (running) {
        $('#status-run').show()
        $('#status-stop').hide()

    } else {
        $('#status-run').hide()
        $('#status-stop').show()
    }

    $('[id^="status"]').text((Math.abs(Date.now() / 1000. - data.time) / 60.).toFixed(2) + 'm')
}


$(document).ready(() => {
    $('#status-run').on('click', () => {
        console.log('reload')
        $.getJSON("/_getCoinData", (data) => {
            showBar(data);
            runStatus(data);
        });


    })

    $('#status-stop').on('click', () => {
        console.log('reload')
        $.getJSON("/_getCoinData", (data) => {
            showBar(data);
            runStatus(data);
        });

        status - stop
    })

    $.getJSON("/_getCoinData", (data) => {
        showBar(data);
        runStatus(data);
    });

    setInterval(function() {
        $.getJSON("/_getCoinData", (data) => {
            showBar(data);
            runStatus(data);
        });
    }, 10 * 1000); // 60 * 1000 milsec


})