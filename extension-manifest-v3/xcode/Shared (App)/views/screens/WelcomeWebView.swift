//
//  WelcomeWebView.swift
//  Ghostery
//
//  Created by Krzysztof Jan Modras on 29.11.21.
//
import WebKit
import SafariServices
import SwiftUI

#if os(iOS)
import UIKit
#elseif os(macOS)
import Cocoa
#endif

let extensionBundleIdentifier = "com.ghostery.lite.extension"

struct WelcomeWebView {
    var openInWebView: (URL) -> Void
    var openSubscriptions: () -> Void
    @State var navigationHelper = WebViewHelper()
    let webView: WKWebView = WKWebView()

    public func load() {
        let userContentHelper = WebViewUserContentHelper(openInWebView: openInWebView, openSubscriptions: openSubscriptions)

        webView.navigationDelegate = navigationHelper
        webView.configuration.userContentController.add(userContentHelper, name: "controller")


        #if os(iOS)
            webView.scrollView.isScrollEnabled = false
            webView.scrollView.contentInsetAdjustmentBehavior = .never
        #endif


        webView.loadFileURL(Bundle.main.url(forResource: "Main", withExtension: "html")!, allowingReadAccessTo: Bundle.main.resourceURL!)
    }
}


class WebViewUserContentHelper: NSObject, WKScriptMessageHandler {
    var openInWebView: (URL) -> Void
    var openSubscriptions: () -> Void

    init(openInWebView: @escaping (URL) -> Void, openSubscriptions: @escaping () -> Void) {
        self.openInWebView = openInWebView
        self.openSubscriptions = openSubscriptions
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        #if os(iOS)
            if (message.body as! String == "install") {
                UIApplication.shared.open(URL(string: "itms-apps://itunes.apple.com/app/id6504861501?pt=126832414&ct=migration&mt=8")!)
            }

            if (message.body as! String == "help") {
                openInWebView(URL(string: "https://www.ghostery.com/blog/adblocker-safari-app-migration")!)
            }

            if (message.body as! String == "mail") {
                UIApplication.shared.open(URL(string: "mailto:support@ghostery.com")!)
            }
        #endif
        #if os(macOS)
            if (message.body as! String == "install") {
                openInWebView(URL(string: "https://apps.apple.com/app/apple-store/id6504861501?pt=126832414&ct=migration&mt=8")!)
            }

            if (message.body as! String == "help") {
                openInWebView(URL(string: "https://www.ghostery.com/blog/adblocker-safari-app-migration")!)
            }

            if (message.body as! String == "mail") {
                openInWebView(URL(string: "mailto:support@ghostery.com")!)
            }
        #endif
    }
}

class WebViewHelper: NSObject, WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        webView.evaluateJavaScript("""
            localize({
                'Privacy Ad Blocker': '\(String(localized: "Privacy Ad Blocker"))',
                'The Ghostery App had&nbsp;to move homes': '\(String(localized: "The Ghostery App had&nbsp;to move homes"))',
                'What you need to do:': '\(String(localized: "What you need to do:"))',
                'Install the new Ghostery App': '\(String(localized: "Install the new Ghostery App"))',
                'Install': '\(String(localized: "Install"))',
                'Delete this app from your device': '\(String(localized: "Delete this app from your device"))',
                'Enjoy Ghostery-grade protection': '\(String(localized: "Enjoy Ghostery-grade protection"))',
                'Need more help?': '\(String(localized: "Need more help?"))',
                'Read our blog post': '\(String(localized: "Read our blog post"))',
                'Or message us at': '\(String(localized: "Or message us at"))',
            })
        """)

        #if os(iOS)
            webView.evaluateJavaScript("show('ios')")
        #elseif os(macOS)
            webView.evaluateJavaScript("show('mac')")

            SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
                guard let state = state, error == nil else {
                    // Insert code to inform the user that something went wrong.
                    return
                }

                DispatchQueue.main.async {
                    webView.evaluateJavaScript("show('mac', \(state.isEnabled))")
                }
            }
        #endif
    }

    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
    }

    func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
    }
}
