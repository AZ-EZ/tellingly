import SwiftUI

@main
struct TellinglyApp: App {
    var body: some Scene {
        WindowGroup {
            TellinglyWebView()
                .ignoresSafeArea(.container, edges: .bottom)
        }
    }
}
