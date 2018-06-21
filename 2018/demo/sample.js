var React = require('react');
var ReactNative = require('react-native');
var {Text} = ReactNative;

var SimpleApp = React.createClass({
    render() {
        return (
            <View>
                <Text>Hello</Text>
            </View>
        )
    }
});

ReactNative.AppRegistry.registerComponent('SimpleApp', () => SimpleApp);
