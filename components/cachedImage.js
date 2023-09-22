import React, { Component } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

export default class CachedImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgURI: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    const { source } = this.props;
    if (source && source.uri) {
      this.loadImage(source.uri);
    }
  }

  componentDidUpdate(prevProps) {
    const { source } = this.props;
    const { source: prevSource } = prevProps;

    if (source && source.uri && (!prevSource || source.uri !== prevSource.uri)) {
      this.loadImage(source.uri);
    }
  }

  loadImage(remoteURI) {
    if (!remoteURI) {
      this.setState({ imgURI: '', isLoading: false });
      return;
    }

    this.setState({ isLoading: true });

    const hashed = Array.from(remoteURI).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const filesystemURI = `${FileSystem.cacheDirectory}${hashed}`;

    FileSystem.getInfoAsync(filesystemURI)
      .then(metadata => {
        if (metadata.exists) {
          this.setState({ imgURI: filesystemURI, isLoading: false });
        } else {
          return FileSystem.downloadAsync(remoteURI, filesystemURI);
        }
      })
      .then(imageObject => {
        if (imageObject) {
          this.setState({ imgURI: imageObject.uri, isLoading: false });
        }
      })
      .catch(err => {
        console.log('Image loading error:', err);
        this.setState({ imgURI: remoteURI, isLoading: false });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading && <ActivityIndicator style={styles.loader} />}
        <Image
          {...this.props}
          onLoadEnd={() => this.setState({ isLoading: false })}
          source={this.state.imgURI ? { uri: this.state.imgURI } : null}
          style={[styles.image, this.props.style]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative"
  },
  loader: {
    position: 'absolute',
    width: "100%",
    height: "100%",

    alignItems: 'center',
    justifyContent: 'center',
  },

});
