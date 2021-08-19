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

function expo(x, f) {
    return Number.parseFloat(x).toExponential(f);
  }

function showBar(data) {

    if(data.marketInfo.symbol != $('#symbolList').val() ){
        return false
    }

    $('#msg').empty()
    $('#msg').append(data.msg)

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

    $('#price .card-header').text(expo(p_close,4) 
    + ' | '+ expo(data.marketInfoUSDT.kline.close,4)  + ' USDT')



    // data.msg.split(/\r?\n/).forEach(element => {
    //     // $('#msg').append('<p class="row m-0 p-0">'+ element +'</p>')
    // });

    n_max = data.marketInfo.balance.n_base_eff

    n_eff = data.marketInfo.balance.n_base_eff
    n_base_f = data.marketInfo.balance.n_base_f
    n_base_t = data.marketInfo.balance.n_base_t
    n_base = n_base_f + n_base_t
    $('#n-eff-prg .progress-bar:eq(2)').css('width', n_base_f / n_max * 100. + '%')
    $('#n-eff-prg .progress-bar:eq(2)').text(n_base_f.toFixed(6))
    $('#n-eff-prg .progress-bar:eq(3)').css('width', n_base_t / n_max * 100. + '%')
    $('#n-eff-prg .progress-bar:eq(3)').text(n_base_t.toFixed(6))


    n_quote2base = n_eff - n_base
    n_quote = data.marketInfo.balance.n_quote_t + data.marketInfo.balance.n_quote_f
    n_quote2base_t = n_quote2base * data.marketInfo.balance.n_quote_t / n_quote
    n_quote2base_f = n_quote2base * data.marketInfo.balance.n_quote_f / n_quote

    $('#n-eff-prg .progress-bar:eq(0)').css('width', (n_quote2base_f / n_max * 100.) + '%')
    $('#n-eff-prg .progress-bar:eq(0)').text(data.marketInfo.balance.n_quote_f.toFixed(6))
    $('#n-eff-prg .progress-bar:eq(1)').css('width', (n_quote2base_t / n_max * 100.) + '%')
    $('#n-eff-prg .progress-bar:eq(1)').text(data.marketInfo.balance.n_quote_t.toFixed(6))


    $('#n-eff-prg .progress-bar:eq(4)').css('width', (100. - n_eff / n_max * 100.) + '%')
    $('#n-eff-prg .progress-bar:eq(4)').text('')


    n_quote_eff = data.marketInfo.balance.n_quote_t + data.marketInfo.balance.n_quote_f
    + (data.marketInfo.balance.n_base_t + data.marketInfo.balance.n_base_f)* p_close

    // $('#n-eff')   
    $('#n-eff-base').text( expo(n_eff,1) )
    $('#n-eff-quote').text( expo(n_quote_eff,1) )

    // billInfo
    let totalAmount = -1.
    let totalLedgerTranAmount = -1.
    let earn = 0.
    let tran = 0.
    let earn_eff = 0.
    if( window.coinDataAmount && window.coinDataList){
        let list_stored = Object.keys(window.coinDataAmount)
        if( window.coinDataList.every( r => list_stored.includes(r)) ){
            for (let [symbol, amountInfo] of Object.entries(window.coinDataAmount)) {
                if(totalAmount == -1){
                    totalAmount = amountInfo.total
                }else{
                    totalAmount += amountInfo.total
                }
                earn +=  amountInfo.total * amountInfo.rate_earn

                tran += amountInfo.total * amountInfo.rate_tran

                let ledgerTranAmount = amountInfo.total / (amountInfo.rate_eff+1.)
                // console.log('ledger', symbol, amountInfo.total, ledgerTranAmount)
                if(totalLedgerTranAmount == -1){
                    totalLedgerTranAmount = ledgerTranAmount
                }else{
                    totalLedgerTranAmount += ledgerTranAmount
                }

                
                earn_eff += ledgerTranAmount * amountInfo.rate_eff
            }
        }
    }
        
    // if(totalAmount > 0.){
    // $('#billInfo-1 .card-text').text( 
    //  (data.billInfo.earn.rate*100.).toFixed(2) + '%'+ ' | ' +  (earn/totalAmount*100.).toFixed(2)+ '%')
    // }else{
    //     $('#billInfo-1 .card-text').text( 
    //         (data.billInfo.earn.rate*100.).toFixed(3) + '%'+ ' | NaN%' )
    // }
    if( window.coinDataAmount && window.coinDataList){
        let amountInfo = window.coinDataAmount[user+'-'+data.marketInfo.symbol]
        $('#billInfo-1 .card-text').text( 
            ( amountInfo.total /(1.+amountInfo.rate_eff) ).toFixed(2) + (amountInfo.rate_eff > 0. ? '+' : '-') + (Math.abs(amountInfo.rate_eff*amountInfo.total /(1.+amountInfo.rate_eff))).toFixed(2)
        )
    }

    if(totalAmount > 0.){
        $('#billInfo-2 .card-text').text( 
            (data.billInfo.tran.rate*100.).toFixed(2) + '%'+ ' | ' +  (tran/totalAmount*100.).toFixed(2)+ '%')
    }else{
        $('#billInfo-2 .card-text').text( 
            (data.billInfo.tran.rate*100.).toFixed(3) + '%'+ ' | NaN%' )
    }

    if(totalAmount > 0.){
        $('#billInfo-3 .card-text').text( 
            (data.billInfo.rate_eff*100.).toFixed(2) + '%'+ ' | ' +  (earn_eff/totalLedgerTranAmount*100.).toFixed(2)+ '%')
    }else{
        $('#billInfo-3 .card-text').text( 
            (data.billInfo.rate_eff*100.).toFixed(3) + '%'+ ' | NaN%' )
    }

    // $('#billInfo-right .card-text').text( 
    //     (data.billInfo.earn.n_base+data.billInfo.earn.n_quote/p_close).toFixed(6) 
    //     + ' | '
    //     + (data.billInfo.earn.hook.n_buy + data.billInfo.earn.hook.n_sell) )

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

        $('#p-hook-left .card-text').text(data.unprocHookInfo.n_buy + ' | ' + expo(p_buy_hook_high,3))
    } else {
        $('#p-hook-left .progress:eq(0) .progress-bar').css('width', '0%')
        $('#p-hook-left .card-text').text(data.unprocHookInfo.n_buy + ' | None')
    }


    if (data.unprocHookInfo.n_sell) {
        $('#p-hook-right .progress:eq(0) .progress-bar:eq(0)').css('width', (p_sell_hook_low - p_close) / p_maxRange * 100. + '%')
        $('#p-hook-right .progress:eq(0) .progress-bar:eq(1)').css('width', (p_sell_hook_high - p_sell_hook_low) / p_maxRange * 100. + '%')

        $('#p-hook-right .card-text').text(expo(p_sell_hook_low,3) + ' | ' + data.unprocHookInfo.n_sell)

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

        $('#p-nail-left .card-text').text((n_nail_buy+n_cut_nail_buy) + ' | ' + expo(p_max_nail,3))
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

        $('#p-nail-right .card-text').text(expo(p_min_nail,3)+ ' | ' + (n_nail_sell+n_cut_nail_sell) )
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

    return true

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
        $.getJSON("/_getCoinDataList/"+user, (data) => {

            console.log('get list : ', data)
            list = data.list_symbol.sort()
            window.coinDataList = list
            resolve(list)
        });  
    })
}

function updateList(list_symbol){
    list_symbol.forEach((symbol)=>{
        console.log(' symbol ', symbol)
        if($('#symbolList option[symbol="'+symbol+'"]').length /= 0){
            // console.log(' symbol found, not append', symbol)
        }else{
            // console.log('append symbol ', symbol)
            $('#symbolList').append("<option symbol='"+symbol+"' selected>"+symbol.substring(symbol.lastIndexOf('-')+1)+"</option>")
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
        $.getJSON("/_getCoinData/"+user+'-'+symbol, (data) => {
            if(window.coinDataAll == undefined){
                window.coinDataAll = {}
            }
            window.coinDataAll[user+'-'+symbol] = data
            // console.log('refreshTrade : ', data.marketInfo.kline.close)
            if(window.coinDataAmount == undefined){
                window.coinDataAmount = {}
            }
            if(data.marketInfo){
                window.coinDataAmount[user+'-'+symbol] = {
                    'total':data.marketInfo.balance.n_base_eff*data.marketInfoUSDT.kline.close,
                    'rate_earn':data.billInfo.earn.rate,
                    'rate_tran':data.billInfo.tran.rate,
                    'rate_eff':data.billInfo.rate_eff
                }
            }

            resolve(data)
        })
        .always(function() { 
            if(window.coinDataAll == undefined){
                window.coinDataAll = {}
            }

            if( window.coinDataAll[user+'-'+symbol]){
                window.coinData = window.coinDataAll[user+'-'+symbol] 
            }
        })

    })

}

function refreshData(){

    return new Promise((resolve, reject)=>{
        refreshList().then((list_symbol)=>{
            console.log('refrssh list ',list_symbol )
            updateList(list_symbol)

            refreshTrade().then((data)=>{
                if(showBar(data)){
                    runStatus(data);
                }
                
                resolve()
            })
        })
    })
}

function nextOption(selector, interval = 1){


    symbolIndex = $( selector ).prop('selectedIndex') //index start form 0

    nextIndex = (symbolIndex + interval) % $( selector+" option" ).length 

    $( selector ).val(
            $( selector + " option:eq("+(nextIndex)+")" ).text()
        ).change()
}

function getStorage(){
    coinDataStorage = JSON.parse(localStorage.getItem('coinData') || '{}') 
    return coinDataStorage
}

function setStorage(data){
    localStorage.setItem('coinData', JSON.stringify(data))
}

$(document).ready(() => {

    // set structure 
    if(window.innerWidth > window.innerHeight){
        $('#container-detail').css('width','35%')
        $('#container-summery').css('width','65%')
        $('#container-detail .container:eq(0)').css('width','00%')
        $('#container-detail .container:eq(1)').css('width','100%')
        // $('#container-detail').css('max-width','500px')
        // $('#container-summery').css('max-width','500px')

    }else{
        $('#container-detail').css('width','100%')
        $('#container-summery').css('width','100%')
        // $('#container-detail').css('max-width','500px')
        // $('#container-summery').css('max-width','500px')
        $('#container-detail .container:eq(0)').css('width','20%')
        $('#container-detail .container:eq(1)').css('width','80%')

    }

    window.addEventListener("resize", function() {

        console.log('resize')
        if(window.innerWidth > window.innerHeight){
            $('#container-detail').css('width','35%')
            $('#container-summery').css('width','65%')
            $('#container-detail .container:eq(0)').css('width','00%')
            $('#container-detail .container:eq(1)').css('width','100%')
            // $('#container-detail').css('max-width','500px')
            // $('#container-summery').css('max-width','500px')
    
        }else{
            $('#container-detail').css('width','100%')
            $('#container-summery').css('width','100%')
            // $('#container-detail').css('max-width','500px')
            // $('#container-summery').css('max-width','500px')
            $('#container-detail .container:eq(0)').css('width','20%')
            $('#container-detail .container:eq(1)').css('width','80%')
    
        }

    })


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
            if(showBar(data)){
                runStatus(data);
            }
        })
    })



    
    coinData = getStorage()
    // console.log('get anchor ', anchorChecked, !anchorChecked)
    if( coinData.anchorChecked != undefined && (! coinData.anchorChecked) ){
        // console.log('anchor clicked to set')
        $('#anchor').get(0).checked = false
        $('#anchor').click()
        // if(coinData.anchorSymbol){
        //     $('#symbolList').val(coinData.anchorSymbol)
        // }
    }else{
        console.log('anchor not to set')
    }

    $('#anchor').change(function(){
        // console.log('anchor changed ', $('#anchor').is(":checked"))
        // window.anchorChecked = $('#anchor').is(":checked")
        // localStorage.setItem('anchorChecked', $('#anchor').is(":checked"))
        coinData = getStorage()
        coinData.anchorChecked = $('#anchor').is(":checked")
        // coinData.anchorSymbol = $('#symbolList').val()
        setStorage(coinData)
    })

    
    refreshData()

    setInterval(function() {
        if( document.visibilityState == 'visible' && (!document.hidden) ){

            // console.log(document.visibilityState)
            refreshTrade().then((data)=>{
                // console.log('get data', data.marketInfo.kline.close)
                if(showBar(data)){
                    runStatus(data);
                }
            })
        }
    }, 10 * 1000); // 10 * 1000 milsec


    setInterval(function() {
        if( document.visibilityState == 'visible' && (!document.hidden) ){
            if(showBar(window.coinData)){
                runStatus(window.coinData);
            }
        }
        
    }, 6 * 1000); // 6 * 1000 milsec    


    // rotate coins
    setInterval(function() {

        if( ( $('#anchor').is(":checked") ) && (!document.hasFocus() ) &&  document.visibilityState == 'visible' && (!document.hidden)){

            // console.log('debug : change option')
            // symbolIndex = $( "#symbolList" ).prop('selectedIndex') //index start form 0

            // nextIndex = (symbolIndex + 1) % $( "#symbolList option" ).length 
    
            // $( "#symbolList" ).val(
            //         $( "#symbolList option:eq("+(nextIndex)+")" ).attr('symbol')
            //     ).change()

            if(window.coinData.lastHookOrder > 5 && window.coinData.lastNailOrder > 5){
                nextOption("#symbolList", 1)
            }
        }

    }, 60*1000)

    document.addEventListener('visibilitychange', function () {
        // 用户离开了当前页面
        if (document.visibilityState === 'hidden') {
        //   document.title = '页面不可见';
            // console.log('hidden')
        }
      
        // 用户打开或回到页面
        if (document.visibilityState === 'visible') {
        //   document.title = '页面可见';
            refreshTrade().then((data)=>{
                // console.log('get data', data.marketInfo.kline.close)
                if(showBar(data)){
                    runStatus(data);
                }
            })
        }
      }, false);

      $(document).keydown(function (event) {

        if (event.isComposing || event.keyCode === 229) {
            return;
        }

        event = event || window.event
        var keyCode = event.which || event.keyCode;

        // console.log(event.which, event.keyCode)

        if(keyCode == 37){
            nextOption("#symbolList", -1)
            event.stopImmediatePropagation();
        }

        if(keyCode == 39){

            nextOption("#symbolList", 1)
            event.stopImmediatePropagation();
        }

    })


    Hammer($('body > div.container').get(0)).on("swipeleft", function() {

        // console.log('left')
        nextOption("#symbolList", -1)
        // event.stopImmediatePropagation();
    });
    
    Hammer($('body > div.container').get(0)).on("swiperight", function() {

        // console.log('right')
        nextOption("#symbolList", 1)
        // event.stopImmediatePropagation();
    });

})