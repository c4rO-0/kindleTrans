
function showBar(data){
    let p_close = data.marketInfo.kline.close
    let p_av_up = data.marketInfo.p_average_up
    let p_av_dn = data.marketInfo.p_average_dn  
    let p_buy_hook = data.unprocHookInfo.p_buy_high
    let p_sell_hook = data.unprocHookInfo.p_sell_low  

    let p_buy_nail = null
    if(data.unprocNailInfo.n_buy + data.cutNailInfo.n_buy > 0){
        p_buy_nail =  Math.min(
            data.unprocNailInfo.p_buy_high == null ? 1.E8 : data.unprocNailInfo.p_buy_high, 
            data.cutNailInfo.p_buy_high == null ? 1.E8 : data.cutNailInfo.p_buy_high)
    }

    let p_sell_nail = null
    if(data.unprocNailInfo.n_sell + data.cutNailInfo.n_sell > 0){
        p_buy_nail =  Math.max(data.unprocNailInfo.p_sell_low, data.cutNailInfo.p_sell_low)
    }


    let p_min = Math.min(p_close, 
        p_av_up     == null ? 1.E8 : p_av_up    , 
        p_av_dn     == null ? 1.E8 : p_av_dn    , 
        p_buy_hook  == null ? 1.E8 : p_buy_hook , 
        p_buy_nail  == null ? 1.E8 : p_buy_nail , 
        p_sell_hook == null ? 1.E8 : p_sell_hook, 
        p_sell_nail == null ? 1.E8 : p_sell_nail)


    let p_max = Math.max(p_close, p_av_up, p_av_dn, p_buy_hook, p_buy_nail, p_sell_hook, p_sell_nail)

    let p_lRange = p_close - p_min
    let p_rRange =  p_max - p_close

    // cal the distance to p_close

    $('#price .card-header').text(p_close.toFixed(6))

    $('#n-eff .card-header').text(data.marketInfo.balance.n_eth_eff.toFixed(8))

    $('#hook-order-filled').text(data.filledHookOrderInfo.n_buy + '+'+data.filledHookOrderInfo.n_sell)

    strTime = data.lastHookOrder.toFixed(1) +'m'
    if(data.lastHookOrder > 60.){
        strTime = (data.lastHookOrder/60.).toFixed(1) +'h'  
    }
    if(data.lastHookOrder > 60.*24){
        strTime = (data.lastHookOrder/60./24.).toFixed(1) +'d'  
    }

    $('#hook-order-last').text(strTime)

    $('#nail-order-filled').text(data.filledNailOrderInfo.n_buy + '+'+data.filledNailOrderInfo.n_sell)

    strTime = data.lastNailOrder.toFixed(1) +'m'
    if(data.lastNailOrder > 60.){
        strTime = (data.lastNailOrder/60.).toFixed(1) +'h'  
    }
    if(data.lastNailOrder > 60.*24){
        strTime = (data.lastNailOrder/60./24.).toFixed(1) +'d'  
    }

    $('#nail-order-last').text(strTime)

    if(p_buy_hook){
        $('#p-hook-left .progress-bar').css('width', (p_close - p_buy_hook)/p_lRange*100. + '%')
        $('#p-hook-left .card-text').text(data.unprocHookInfo.n_buy +' | -'+(p_close - p_buy_hook).toFixed(6) )
    }else{
        $('#p-hook-left .progress-bar').css('width', '0%')
        $('#p-hook-left .card-text').text(data.unprocHookInfo.n_buy +' | None')
    }
    
    if(p_sell_hook){
        $('#p-hook-right .progress-bar').css('width', (p_sell_hook - p_close )/p_rRange*100. + '%')
        $('#p-hook-right .card-text').text( '+'+(p_sell_hook - p_close).toFixed(6) + ' | ' + data.unprocHookInfo.n_sell)

    }else{
        $('#p-hook-right .progress-bar').css('width', '0%')
        $('#p-hook-right .card-text').text( 'None | ' + data.unprocHookInfo.n_sell)
    }


    if(p_buy_nail){
        $('#p-nail-left .progress-bar').css('width', (p_close - p_buy_nail)/p_lRange*100. + '%')
        $('#p-nail-left .card-text').text(data.unprocNailInfo.n_buy +' | -'+(p_close - p_buy_nail).toFixed(6) )
    }else{
        $('#p-nail-left .progress-bar').css('width', '0%')
        $('#p-nail-left .card-text').text(data.unprocNailInfo.n_buy +' | None')
    }
    
    if(p_sell_nail){
        $('#p-nail-right .progress-bar').css('width', (p_sell_nail - p_close )/p_rRange*100. + '%')
        $('#p-nail-right .card-text').text( '+'+(p_sell_nail - p_close).toFixed(6) + ' | ' + data.unprocNailInfo.n_sell)     
    }else{
        $('#p-nail-right .progress-bar').css('width', '0%')
        $('#p-nail-right .card-text').text( 'None | ' + data.unprocNailInfo.n_sell)
    }

    if(p_av_dn){
        $('#p-av-left .progress-bar').css('width', (p_close - p_av_dn)/p_lRange*100. + '%')
        $('#p-av-left .card-text').text('-'+(p_close - p_av_dn).toFixed(6) )        
    }else{
        $('#p-av-left .progress-bar').css('width', '0%')
        $('#p-av-left .card-text').text('None' )   
    }
    
    if(p_av_up){
        $('#p-av-right .progress-bar').css('width', (p_av_up - p_close )/p_rRange*100. + '%')
        $('#p-av-right .card-text').text('+'+(p_av_up - p_close).toFixed(6) )  
    }else{
        $('#p-av-right .progress-bar').css('width', '0%')
        $('#p-av-right .card-text').text('None' )   
    }

}

function runStatus(data){
    
    running = Math.abs(Date.now()/ 1000. - data.time) <= 6.*60

    if(running){
       $('#status-run').show()
       $('#status-stop').hide()

    }else{
        $('#status-run').hide()
        $('#status-stop').show()        
    }

    $('[id^="status"]').text(( Math.abs(Date.now()/ 1000. - data.time)/60. ).toFixed(2)+'m' )
}

$.getJSON("/_getCoinData", (data)=>{
    showBar(data);
    runStatus(data);
});

setInterval(function() {
    $.getJSON("/_getCoinData", (data)=>{
        showBar(data);
        runStatus(data);
    });
}, 10 * 1000); // 60 * 1000 milsec


