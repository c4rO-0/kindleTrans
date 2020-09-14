function toggleNewFeatures() {
    let target = document.getElementById('newFeatures')
    if (target.classList.contains('newFeaturesHide')) {
        target.classList.remove('newFeaturesHide')
    } else {
        target.classList.add('newFeaturesHide')
    }
}

function hideNewFeature(event) {
    let target = document.getElementById('newFeatures')
    if (!event.target.closest('#newFeatures') && !target.classList.contains('newFeaturesHide')) {
        target.classList.add('newFeaturesHide')
    }
}

function showNewFeatures() {
    let target = document.getElementById('newFeatures')
    if (target.classList.contains('newFeaturesHide')) {
        target.classList.remove('newFeaturesHide')
    }
}

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
        p_buy_nail_high = data.unprocNailInfo.p_buy_high
        p_buy_nail_low = data.unprocNailInfo.p_buy_low
    }

    let p_buy_cut_nail_high = null
    let p_buy_cut_nail_low = null
    if (data.cutNailInfo.n_buy > 0) {
        p_buy_cut_nail_high = data.cutNailInfo.p_buy_high
        p_buy_cut_nail_low = data.cutNailInfo.p_buy_low
    }    


    let p_sell_nail_low = null
    let p_sell_nail_high = null
    if (data.unprocNailInfo.n_sell> 0) {
        p_sell_nail_low = data.unprocNailInfo.p_sell_low
        p_sell_nail_high = data.unprocNailInfo.p_sell_high
    }

    let p_sell_cut_nail_low = null
    let p_sell_cut_nail_high = null
    if (data.cutNailInfo.n_sell > 0) {
        p_sell_cut_nail_low = data.cutNailInfo.p_sell_low
        p_sell_cut_nail_high = data.cutNailInfo.p_sell_high
    }


    let p_min = Math.min(p_close,
        p_av_up              == null ? 1.E8 : p_av_up              ,
        p_av_dn              == null ? 1.E8 : p_av_dn              ,
        p_buy_hook_low       == null ? 1.E8 : p_buy_hook_low       ,
        p_buy_nail_low       == null ? 1.E8 : p_buy_nail_low       ,
        p_buy_cut_nail_low   == null ? 1.E8 : p_buy_cut_nail_low   ,
        p_buy_hook_high      == null ? 1.E8 : p_buy_hook_high      ,
        p_buy_nail_high      == null ? 1.E8 : p_buy_nail_high      ,
        p_buy_cut_nail_high  == null ? 1.E8 : p_buy_cut_nail_high  ,
        p_sell_hook_low      == null ? 1.E8 : p_sell_hook_low      ,
        p_sell_nail_low      == null ? 1.E8 : p_sell_nail_low      ,
        p_sell_cut_nail_low  == null ? 1.E8 : p_sell_cut_nail_low  ,
        p_sell_hook_high     == null ? 1.E8 : p_sell_hook_high     ,
        p_sell_nail_high     == null ? 1.E8 : p_sell_nail_high     ,
        p_sell_cut_nail_high == null ? 1.E8 : p_sell_cut_nail_high ,
    )

    let p_max = Math.max(
        p_av_up              == null ? -1. : p_av_up                ,
        p_av_dn              == null ? -1. : p_av_dn                ,
        p_buy_hook_low       == null ? -1. : p_buy_hook_low         ,
        p_buy_nail_low       == null ? -1. : p_buy_nail_low         ,
        p_buy_cut_nail_low   == null ? -1. : p_buy_cut_nail_low     ,
        p_buy_hook_high      == null ? -1. : p_buy_hook_high        ,
        p_buy_nail_high      == null ? -1. : p_buy_nail_high        ,
        p_buy_cut_nail_high  == null ? -1. : p_buy_cut_nail_high    ,
        p_sell_hook_low      == null ? -1. : p_sell_hook_low        ,
        p_sell_nail_low      == null ? -1. : p_sell_nail_low        ,
        p_sell_cut_nail_low  == null ? -1. : p_sell_cut_nail_low    ,
        p_sell_hook_high     == null ? -1. : p_sell_hook_high       ,
        p_sell_nail_high     == null ? -1. : p_sell_nail_high       ,
        p_sell_cut_nail_high == null ? -1. : p_sell_cut_nail_high   ,
    )

    let p_lRange = p_close - p_min
    let p_rRange = p_max - p_close
    let p_maxRange = Math.max(p_lRange, p_rRange)

    // cal the distance to p_close

    $('#price .card-header').text(p_close.toFixed(6) 
    + (data.marketInfo.line_k > 0. ? '+' : '-' )
    + Math.abs(data.marketInfo.line_k).toExponential(1)
    + ' | '+ data.marketInfoUSDT.kline.close.toFixed(2) + ' USDT')

    

    $('#msg').empty()
    $('#msg').append(data.msg)
    

    // data.msg.split(/\r?\n/).forEach(element => {
    //     // $('#msg').append('<p class="row m-0 p-0">'+ element +'</p>')
    // });


    n_max = Math.ceil(data.marketInfo.balance.n_base_eff)

    n_eff = data.marketInfo.balance.n_base_eff
    n_base_f = data.marketInfo.balance.n_base_f
    n_base_t = data.marketInfo.balance.n_base_t
    n_base = n_base_f + n_base_t
    $('#n-eff-prg .progress-bar:eq(0)').css('width', n_base_f / n_max * 100. + '%')
    $('#n-eff-prg .progress-bar:eq(0)').text(n_base_f.toFixed(6))
    $('#n-eff-prg .progress-bar:eq(1)').css('width', n_base_t / n_max * 100. + '%')
    $('#n-eff-prg .progress-bar:eq(1)').text(n_base_t.toFixed(6))


    n_quote2base = n_eff - n_base
    n_quote = data.marketInfo.balance.n_quote_t + data.marketInfo.balance.n_quote_f
    n_quote2base_t = n_quote2base * data.marketInfo.balance.n_quote_t / n_quote
    n_quote2base_f = n_quote2base * data.marketInfo.balance.n_quote_f / n_quote

    $('#n-eff-prg .progress-bar:eq(2)').css('width', (n_quote2base_f / n_max * 100.) + '%')
    $('#n-eff-prg .progress-bar:eq(2)').text(n_quote2base_f.toFixed(6))
    $('#n-eff-prg .progress-bar:eq(3)').css('width', (n_quote2base_t / n_max * 100.) + '%')
    $('#n-eff-prg .progress-bar:eq(3)').text(n_quote2base_t.toFixed(6))


    $('#n-eff-prg .progress-bar:eq(4)').css('width', (100. - n_eff / n_max * 100.) + '%')
    $('#n-eff-prg .progress-bar:eq(4)').text((n_max - n_eff).toFixed(6))

    $('#n-eff').text(n_eff.toFixed(4))
    
    // billInfo
    $('#billInfo-left .card-text').text( 
        (data.billInfo.tran.hook.n_buy + data.billInfo.tran.hook.n_sell) 
        + ' | '
        + (data.billInfo.tran.n_base+data.billInfo.tran.n_quote/p_close).toFixed(6) )
    $('#billInfo-right .card-text').text( 
        (data.billInfo.earn.n_base+data.billInfo.earn.n_quote/p_close).toFixed(6) 
        + ' | '
        + (data.billInfo.earn.hook.n_buy + data.billInfo.earn.hook.n_sell) )

    $('#hook-order-filled').text(data.filledHookOrderInfo.n_buy + '+' + data.filledHookOrderInfo.n_sell)
    
    if(data.lastHookOrder){
        strTime = data.lastHookOrder.toFixed(1) + 'm'
        if (data.lastHookOrder > 60.) {
            strTime = (data.lastHookOrder / 60.).toFixed(1) + 'h'
        }
        if (data.lastHookOrder > 60. * 24) {
            strTime = (data.lastHookOrder / 60. / 24.).toFixed(1) + 'd'
        }
    }else{
        strTime = 'Nm'
    }


    $('#hook-order-last').text(strTime)

    $('#nail-order-filled').text(data.filledNailOrderInfo.n_buy + '+' + data.filledNailOrderInfo.n_sell)

    if(data.lastNailOrder){
        strTime = data.lastNailOrder.toFixed(1) + 'm'
        if (data.lastNailOrder > 60.) {
            strTime = (data.lastNailOrder / 60.).toFixed(1) + 'h'
        }
        if (data.lastNailOrder > 60. * 24) {
            strTime = (data.lastNailOrder / 60. / 24.).toFixed(1) + 'd'
        }
    }else{
        strTime = 'Nm'
    }

    $('#nail-order-last').text(strTime)

    if (data.unprocHookInfo.n_buy) {
        $('#p-hook-left .progress:eq(0) .progress-bar:eq(0)').css('width', (p_close - p_buy_hook_high) / p_maxRange * 100. + '%')
        $('#p-hook-left .progress:eq(0) .progress-bar:eq(1)').css('width', (p_buy_hook_high - p_buy_hook_low) / p_maxRange * 100. + '%')

        $('#p-hook-left .card-text').text(data.unprocHookInfo.n_buy + ' | ' + (p_buy_hook_high).toFixed(6))
    } else {
        $('#p-hook-left .progress:eq(0) .progress-bar').css('width', '0%')
        $('#p-hook-left .card-text').text(data.unprocHookInfo.n_buy + ' | None')
    }


    if (data.unprocHookInfo.n_sell) {
        $('#p-hook-right .progress:eq(0) .progress-bar:eq(0)').css('width', (p_sell_hook_low - p_close) / p_maxRange * 100. + '%')
        $('#p-hook-right .progress:eq(0) .progress-bar:eq(1)').css('width', (p_sell_hook_high - p_sell_hook_low) / p_maxRange * 100. + '%')

        $('#p-hook-right .card-text').text((p_sell_hook_low).toFixed(6) + ' | ' + data.unprocHookInfo.n_sell)

    } else {
        $('#p-hook-right .progress:eq(0) .progress-bar').css('width', '0%')
        $('#p-hook-right .card-text').text('None | ' + data.unprocHookInfo.n_sell)
    }


    n_nail_buy = data.unprocNailInfo.n_buy
    if (n_nail_buy) {
        $('#p-nail-left .progress:eq(0) .progress-bar:eq(0)').css('width', (p_close - p_buy_nail_high) / p_maxRange * 100. + '%')
        $('#p-nail-left .progress:eq(0) .progress-bar:eq(1)').css('width', (p_buy_nail_high - p_buy_nail_low) / p_maxRange * 100. + '%')

        // $('#p-nail-left .card-text').text(n_nail_buy + ' | ' + (p_buy_nail_high).toFixed(6))

    } else {
        $('#p-nail-left .progress:eq(0) .progress-bar').css('width', '0%')
        // $('#p-nail-left .card-text').text(n_nail_buy + ' | None')
    }

    n_cut_nail_buy = data.cutNailInfo.n_buy
    if (n_cut_nail_buy) {
        $('#p-nail-left .progress:eq(1) .progress-bar:eq(0)').css('width', (p_close - p_buy_cut_nail_high) / p_maxRange * 100. + '%')
        $('#p-nail-left .progress:eq(1) .progress-bar:eq(1)').css('width', (p_buy_cut_nail_high - p_buy_cut_nail_low) / p_maxRange * 100. + '%')

        // $('#p-nail-left .card-text').text(n_cut_nail_buy + ' | ' + (p_buy_cut_nail_high).toFixed(6))

    } else {
        $('#p-nail-left .progress:eq(1) .progress-bar').css('width', '0%')
        // $('#p-nail-left .card-text').text(n_cut_nail_buy + ' | None')
    } 
    
    if(n_nail_buy+n_cut_nail_buy){
        p_max_nail = Math.max(
            p_buy_nail_high     == null ? -1. : p_buy_nail_high ,
            p_buy_cut_nail_high == null ? -1. : p_buy_cut_nail_high)

        $('#p-nail-left .card-text').text((n_nail_buy+n_cut_nail_buy) + ' | ' + (p_max_nail.toFixed(6)))
    }else{
        $('#p-nail-left .card-text').text( (n_nail_buy + n_cut_nail_buy) + ' | None')
    }



    n_nail_sell = data.unprocNailInfo.n_sell
    if (n_nail_sell) {

        $('#p-nail-right .progress:eq(0) .progress-bar:eq(0)').css('width', (p_sell_nail_low - p_close) / p_maxRange * 100. + '%')
        $('#p-nail-right .progress:eq(0) .progress-bar:eq(1)').css('width', (p_sell_nail_high - p_sell_nail_low) / p_maxRange * 100. + '%')

        // $('#p-nail-right .card-text').text((p_sell_nail_low).toFixed(6) + ' | ' + n_nail_sell)

    } else {
        $('#p-nail-right .progress:eq(0) .progress-bar').css('width', '0%')
        // $('#p-nail-right .card-text').text('None | ' + n_nail_sell)
    }

    n_cut_nail_sell = data.cutNailInfo.n_sell
    if (n_cut_nail_sell) {

        $('#p-nail-right .progress:eq(1) .progress-bar:eq(0)').css('width', (p_sell_cut_nail_low - p_close) / p_maxRange * 100. + '%')
        $('#p-nail-right .progress:eq(1) .progress-bar:eq(1)').css('width', (p_sell_cut_nail_high - p_sell_cut_nail_low) / p_maxRange * 100. + '%')

        // $('#p-nail-right .card-text').text((p_sell_cut_nail_low).toFixed(6) + ' | ' + n_cut_nail_sell)

    } else {
        $('#p-nail-right .progress:eq(1) .progress-bar').css('width', '0%')
        // $('#p-nail-right .card-text').text('None | ' + n_cut_nail_sell)
    }

    if(n_nail_sell+n_cut_nail_sell){
        p_min_nail = Math.min(
            p_sell_nail_low     == null ? 1.E6 : p_sell_nail_low ,
            p_sell_cut_nail_low == null ? 1.E6 : p_sell_cut_nail_low)

        $('#p-nail-right .card-text').text((p_min_nail.toFixed(6))+ ' | ' + (n_nail_sell+n_cut_nail_sell) )
    }else{
        $('#p-nail-right .card-text').text('None | ' + (n_nail_sell+n_cut_nail_sell) )
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



    let n_limit_trade_stop = Math.max(
        data.config.n_buy_limit_stop_sell, data.config.n_buy_limit_stop_sell, 
        n_cut_nail_buy+n_nail_buy, 
        n_cut_nail_sell+n_nail_sell) 

    // hook


    // console.log(data.unprocNailInfo.n_buy, data.config)
    $('#buy-limit .progress-bar:eq(0)').css('width', (n_cut_nail_buy) / n_limit_trade_stop * 100. + '%')
    $('#buy-limit .progress-bar:eq(1)').css('width', (n_nail_buy) / n_limit_trade_stop * 100. + '%')

    $('#buy-limit .progress-bar:eq(0) span').text(n_cut_nail_buy)
    $('#buy-limit .progress-bar:eq(1) span').text(n_nail_buy)    

    $('#buy-limit .progress-bar:eq(0)').removeClass('bg-danger-dark bg-warning-dark bg-success-dark') 
    $('#buy-limit .progress-bar:eq(1)').removeClass('bg-danger bg-warning bg-success')


    if (n_nail_buy+n_cut_nail_buy >= 0.8 * data.config.n_buy_limit_stop_sell) {
        $('#buy-limit .progress-bar:eq(0)').addClass('bg-danger-dark')
        $('#buy-limit .progress-bar:eq(1)').addClass('bg-danger')
    } else if (n_nail_buy+n_cut_nail_buy >= 0.4 * data.config.n_buy_limit_stop_sell) {
        $('#buy-limit .progress-bar:eq(0)').addClass('bg-warning-dark')
        $('#buy-limit .progress-bar:eq(1)').addClass('bg-warning')
    } else {
        $('#buy-limit .progress-bar:eq(0)').addClass('bg-success-dark')
        $('#buy-limit .progress-bar:eq(1)').addClass('bg-success')
    }


    $('#sell-limit .progress-bar:eq(0)').css('width', (n_cut_nail_sell) / n_limit_trade_stop * 100. + '%')
    $('#sell-limit .progress-bar:eq(1)').css('width', (n_nail_sell) / n_limit_trade_stop * 100. + '%')

    $('#sell-limit .progress-bar:eq(0)  span').text(n_cut_nail_sell)
    $('#sell-limit .progress-bar:eq(1)  span').text(n_nail_sell)

    $('#sell-limit .progress-bar:eq(0)').removeClass('bg-danger-dark bg-warning-dark bg-success-dark') 
    $('#sell-limit .progress-bar:eq(1)').removeClass('bg-danger bg-warning bg-success')

    if (n_nail_sell+n_cut_nail_sell >= 0.8 * data.config.n_sell_limit_stop_buy) {
        $('#sell-limit .progress-bar:eq(0)').addClass('bg-danger-dark')
        $('#sell-limit .progress-bar:eq(1)').addClass('bg-danger')
    } else if (n_nail_sell+n_cut_nail_sell >= 0.4 * data.config.n_sell_limit_stop_buy) {
        $('#sell-limit .progress-bar:eq(0)').addClass('bg-warning-dark')
        $('#sell-limit .progress-bar:eq(1)').addClass('bg-warning')
    } else {
        $('#sell-limit .progress-bar:eq(0)').addClass('bg-success-dark')
        $('#sell-limit .progress-bar:eq(1)').addClass('bg-success')
    }

    $('#unpaired-buy .progress-bar').css('width', (data.unpairedHookOrderInfo.n_sell) / n_limit_trade_stop * 100. + '%')
    $('#unpaired-sell .progress-bar').css('width', (data.unpairedHookOrderInfo.n_buy) / n_limit_trade_stop * 100. + '%')

    $('#unpaired-buy .progress-bar span').text(data.unpairedHookOrderInfo.n_sell)
    $('#unpaired-sell .progress-bar span').text(data.unpairedHookOrderInfo.n_buy)

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

    $('[id^="status-"]').text((Math.abs(Date.now() / 1000. - data.time) / 60.).toFixed(2) + 'm')
}

function refreshList(){

    return new Promise((resolve, reject)=>{
        $.getJSON("/_getCoinDataList", (data) => {
            window.coinDataList = data.list_symbol
            resolve(data.list_symbol)
        });  
    })
}

function updateList(list_symbol){
    list_symbol.forEach((symbol)=>{
        if($('#symbolList').has("option[name='"+symbol+"']")){

        }else{
            $('#symbolList').append("<option symbol='"+symbol+"' selected>"+symbol+"</option>")
        }
    })

    list_symbol_page = []
    
    $('#symbolList option').each((index,oEle) =>{
        list_symbol_page.push($(oEle).attr('symbol'))
    })

    list_symbol_page.forEach(symbol =>{
        if(list_symbol.indexOf(symbol) < 0 ){
            console.log('not find ', symbol)
            $("#symbolList option[symbol='"+symbol+"']").remove()
        }
    })

}

function refreshTrade(){
    
    return new Promise((resolve, reject)=>{
        symbol = $('#symbolList').val()

        // console.log('ask symbol', symbol)
        $.getJSON("/_getCoinData/"+symbol, (data) => {
            window.coinData = data
            // console.log('refreshTrade : ', data.marketInfo.kline.close)
            resolve(data)
        });

    })

}

function refreshData(){

    return new Promise((resolve, reject)=>{
        refreshList().then((list_symbol)=>{
            updateList(list_symbol)

            refreshTrade().then((data)=>{
                showBar(data);
                runStatus(data);
                resolve()
            })
        })
    })
}

$(document).ready(() => {
    $('#status-run').on('click', () => {
        console.log('reload')
        refreshData()
    })

    $('#status-stop').on('click', () => {
        console.log('reload')
        refreshData()
    })

    $( "#symbolList" ).change(function () {

        refreshTrade().then((data)=>{
            // console.log('get data', data.marketInfo.kline.close)
            showBar(data);
            runStatus(data);
        })
    })

    refreshData()

    setInterval(function() {
        refreshTrade().then((data)=>{
            // console.log('get data', data.marketInfo.kline.close)
            showBar(data);
            runStatus(data);
        })
    }, 10 * 1000); // 60 * 1000 milsec


    setInterval(function() {
        showBar(window.coinData);
        runStatus(window.coinData);
        
    }, 6 * 1000); // 60 * 1000 milsec    


})