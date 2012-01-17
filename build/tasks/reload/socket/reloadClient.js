/**
 * Reload Task Client script
 *
 * Created by webxl
 * Date: 1/11/12
 *
 */

$(function() {

	var reloader = function Reloader() {

		var url = 'ws://localhost:8000';

		return {
			isSocketConnected:function () {
				return this.socket && this.socket.readyState === WebSocket.OPEN;
			},
			connect:function () {
				if (this.isSocketConnected()) {
					return;
				}
				if (this.connectTimeout) {
					clearTimeout(this.connectTimeout);
				}
				this.socket = new WebSocket(url);

				this.socket.onmessage = function (msg) {
					this.close();
					console.log(msg.data);
					window.document.location.reload();
				}
				// Todo: reconnect support
			}
		};

	}();

	setTimeout(function() { reloader.connect(); }, 3000);

});
