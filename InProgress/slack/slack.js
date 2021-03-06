exports.id ="slack"
exports.title ="Slack"
exports.group ="Template Components"
exports.color ="#00CED1"
exports.input =true
exports.output =1
exports.version ="0.0.2"
exports.author ="Tom Roper"
exports.icon ="slack"

exports.readme = ''

exports.html = `<div class="padding">
    <div class="row">
        <div class="col-md-12">
            <div data-jc="textbox" data-jc-path="slackToken" data-jc-config="placeholder:OAuthToken">@(slackToken) </div>
            <div class="help">You need a token bruh</div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div data-jc="textbox" data-jc-path="conversationId" data-jc-config="placeholder:conversationId">@(conversationId) </div>
            <div class="help">What channel bruh</div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div data-jc="textbox" data-jc-path="defaultMessage" data-jc-config="placeholder:Default Slack message">@(defaultMessage) </div>
            <div class="help">Say something bruh</div>
        </div>
    </div>
</div>
`

exports.install = function(instance) {
    const { WebClient } = require('@slack/web-api')
    const util = require('util')

    // An access token (from your Slack app or custom integration - xoxp, xoxb)
    let token = FLOW.variables.slackToken || instance.options.slackToken
    let conversationId = FLOW.variables.conversationId || instance.options.conversationId

    let fuckups=[]
    if (!token) {
        fuckups.push("This component requires Slack auth token")
    }
    if (!conversationId) {
        fuckups.push("This component requires a Slack conversation ID")
    }
    if (fuckups.length > 0) {
        instance.status(fuckups.join('\n'), "red");
    }
    const web = new WebClient(token)
    const sendit = async function(message) {
        let response
        try {
            let body = { channel: conversationId, text: message }
            instance.send(0, JSON.stringify(body))
            response = await web.chat.postMessage(body)
        } catch (err) {
            instance.send(0, `Slack message post failed: ${err.message}`)
            throw err
        }
    }

	instance.on('data', function(flowdata) {
        let message = flowdata.data['message']
        message = message || FLOW.variables.defaultMessage || instance.options.defaultMessage
        sendit(message)
    })
}
