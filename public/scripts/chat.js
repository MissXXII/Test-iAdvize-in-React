var messageList = [];

var Container = React.createClass({
    render: function(){
        return(
            <div className="container">
                <ChatBox user={'User1'}/>
                <ChatBox user={'User2'}/>
            </div>
        );
    }
});


var ChatBox = React.createClass({

    loadMessageFromLocal: function() {
        this.setState({data: messageList});
    },
    handleMessageSubmit: function(newMessage) {
        messageList.push(newMessage);
        this.setState({data: messageList});
    },
    getInitialState: function() {
        return {data: []};
    },
    render: function() {
        var user = this.props.user;
        return (
          <section className="chatBox">
            <h2>Chat {user}</h2>
            <ChatWindow data={this.state.data} user={user}/>
            <ChatForm onMessageSubmit={this.handleMessageSubmit} user={user}/>
          </section>
        );
    },
    componentDidMount: function() {
        this.loadMessageFromLocal();
        setInterval(this.loadMessageFromLocal, this.props.pollInterval);
    }
});

var ChatWindow = React.createClass({
  render: function() {
      var user = this.props.user;
      var chatlineNodes = this.props.data.map(function(message) {
      return (
        <Message time={message.time} author={message.author} key={message.id} user={user}>
          {message.text}
        </Message>
      );
    });
    return (
      <div className="chatWindow">
        {chatlineNodes}
      </div>
    );
  }
});

var Message = React.createClass({
    rawMarkup: function() {
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return { __html: rawMarkup };
  },
    render: function() {
        var user = this.props.user;
        var author = this.props.author;
        var spanClass;
        if(author == user){
            spanClass = 'sender';
        } else {
            spanClass = 'recipient';
        }
        return (
          <span className="message">
            <span className="time">{this.props.time}</span>
            <span className={spanClass}>
              {'<'}{this.props.author}{'> : '}
            </span>
            <span dangerouslySetInnerHTML={this.rawMarkup()}/>
          </span>
    );
  }
});

var ChatForm = React.createClass({
    getInitialState: function() {
            return {author: '', text: ''};
    },
    handleTextChange: function(e) {
        this.setState({text: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var author = this.props.user;
        var text = this.state.text.trim();

        var getTime = function() {
            var date = new Date();
            function pad(n) {
                return n < 10 ? '0' + n : n;
            } // return the time formated 00 if time < 10
            var hours = pad(date.getHours());
            var minutes = pad(date.getMinutes());
            var secondes = pad(date.getSeconds());
            var time = '[' + hours + ':' + minutes + ':' + secondes + ']';
            return time;
        };
        var id = Date.now();
            if (!text || !author) {
              return;
            }
        this.props.onMessageSubmit({id: id, author: author, text: text, time: getTime()});
        this.setState({author: '', text: ''});
    },
    render: function() {
        var user = this.props.user;
        return (
            <form className="messageForm" onSubmit={this.handleSubmit}>
                <input
                    className="messageToSend"
                    type="text"
                    placeholder="Send Message..."
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
                <input className="sendButton" type="submit" value="Send" />
            </form>
        );
    }
});

ReactDOM.render(
  <Container data={messageList} pollInterval={2000}/>,
  document.getElementById('content')
);
