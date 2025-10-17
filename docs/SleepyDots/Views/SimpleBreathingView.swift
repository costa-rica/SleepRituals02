import SwiftUI

struct SimpleBreathingView: View {
    let gameState: GameState
    
    @StateObject private var breathingPhysics = BreathingPhysics()
    @State private var sessionTimer: Timer?
    @State private var hasShownFirstCycle = false
    @State private var cycleCount = 0
    @State private var textOpacity: Double = 0.0  // Start invisible for gentle fade-in
    @State private var currentInstructionText: String = "Breathe In"
    @State private var breathingScale: Double = 0.0 // 0.0 = small, 1.0 = large
    @State private var isHoldPhase: Bool = false
    @State private var blackOverlayOpacity: Double = 0.0
    
    // Animation constants
    private let smallRadius: Double = 40.0 // 2x the dot radius (20px) from DotsGameView
    private let transitionDuration: Double = 1.2  // Slower, more meditative text transitions
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Black background
                Color.black.ignoresSafeArea()
                
                // Main breathing dot
                breathingDot(screenWidth: geometry.size.width)
                
                // Instruction text
                VStack {
                    Spacer()
                    
                    Text(currentInstructionText)
                        .font(.system(size: 16, weight: .thin, design: .default))
                        .foregroundColor(.white.opacity(0.95))
                        .opacity(shouldShowInstructions ? textOpacity : 0)
                        .animation(.easeInOut(duration: transitionDuration), value: textOpacity)
                        .animation(.easeInOut(duration: transitionDuration), value: shouldShowInstructions)
                    
                    Spacer()
                        .frame(height: 120) // Fixed spacing below animation area
                }
                
                // Black overlay for fade-out transition
                Color.black
                    .ignoresSafeArea()
                    .opacity(blackOverlayOpacity)
            }
        }
        .onAppear {
            setupBreathing()
            startSessionTimer()
            
            // Capture the primary color for this entire session
            sessionPrimaryColor = primaryColor
            
            // Start in small state and immediately animate to current phase target
            breathingScale = 0.0
            withAnimation(.easeInOut(duration: phaseDuration)) {
                breathingScale = targetBreathingScale
            }
            
            // Clear transition color after a brief delay so next level starts fresh
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                gameState.transitionLeaderColor = nil
            }
            
            // Fade in the initial "Breathe In" text with the same gentle timing as other transitions
            withAnimation(.easeInOut(duration: transitionDuration)) {
                textOpacity = 1.0
            }
        }
        .onDisappear {
            sessionTimer?.invalidate()
        }
        .onReceive(NotificationCenter.default.publisher(for: UIApplication.willResignActiveNotification)) { _ in
            // App is going to background, auto-progress to next level
            progressToNextLevel()
        }
        .onChange(of: breathingPhysics.currentPhase) { _, newPhase in
            handlePhaseChange(newPhase)
        }
    }
    
    // MARK: - Breathing Dot
    
    private func breathingDot(screenWidth: Double) -> some View {
        let currentSize = calculateDotSize(screenWidth: screenWidth)
        let currentGradient = createDotGradient(screenWidth: screenWidth)
        
        return Circle()
            .fill(currentGradient)
            .frame(width: currentSize, height: currentSize)
            .scaleEffect(isHoldPhase ? 1.02 : 1.0)
            .animation(.easeInOut(duration: 0.8).repeatForever(autoreverses: true), value: isHoldPhase)
    }
    
    
    // MARK: - Computed Properties
    
    @State private var sessionPrimaryColor: Color?
    
    private var primaryColor: Color {
        // Use the session color once it's set, otherwise use transition color
        if let sessionColor = sessionPrimaryColor {
            return sessionColor
        } else if let transitionColor = gameState.transitionLeaderColor {
            return transitionColor
        } else {
            return ColorPalette.pulsatingColorForLevel(gameState.currentLevel)
        }
    }
    
    private var targetBreathingScale: Double {
        switch breathingPhysics.currentPhase {
        case .breatheIn, .hold:
            return 1.0 // Large state
        case .breatheOut, .holdOut:
            return 0.0 // Small state
        }
    }
    
    private var phaseDuration: Double {
        return 4.0 // All phases are 4 seconds for box breathing
    }
    
    
    private var shouldShowInstructions: Bool {
        return true // Show instructions throughout all cycles
    }
    
    // MARK: - Helper Functions
    
    private func calculateDotSize(screenWidth: Double) -> Double {
        let minSize = smallRadius * 2 // 80px diameter (40px radius)
        let maxSize = screenWidth * 0.75 // 75% of screen width
        
        // Smoothly interpolate between min and max size based on breathing scale
        return minSize + (maxSize - minSize) * breathingScale
    }
    
    private func createDotGradient(screenWidth: Double) -> RadialGradient {
        let currentSize = calculateDotSize(screenWidth: screenWidth)
        
        
        if breathingScale < 0.3 {
            // Small state: simple gradient at 60% opacity
            return RadialGradient(
                gradient: Gradient(stops: [
                    .init(color: primaryColor.opacity(0.6 * 0.6), location: 0.0),
                    .init(color: primaryColor.opacity(0.6 * 1.0), location: 1.0)
                ]),
                center: .center,
                startRadius: 0,
                endRadius: currentSize * 0.5
            )
        } else {
            // Large state: clearer center with better gradient definition
            return RadialGradient(
                gradient: Gradient(stops: [
                    .init(color: primaryColor.opacity(0.0), location: 0.0),
                    .init(color: primaryColor.opacity(0.10), location: 0.5),
                    .init(color: primaryColor.opacity(0.35), location: 0.8),
                    .init(color: primaryColor.opacity(0.7), location: 0.95),
                    .init(color: primaryColor.opacity(1.0), location: 1.0)
                ]),
                center: .center,
                startRadius: 0,
                endRadius: currentSize * 0.5
            )
        }
    }
    
    
    private func setupBreathing() {
        // Set breathing physics to box breathing pattern (4-4-4-4)
        breathingPhysics.setBreathingPattern(.square)
    }
    
    private func handlePhaseChange(_ newPhase: BreathingPhase) {
        // Update hold phase state for oscillation animation
        isHoldPhase = (newPhase == .hold || newPhase == .holdOut)
        
        // Update instruction text based on phase
        let newText = instructionTextForPhase(newPhase)
        
        // If we're still showing instructions, handle text transition
        if shouldShowInstructions {
            withAnimation(.easeInOut(duration: transitionDuration)) {
                textOpacity = 0.0
            }
            
            DispatchQueue.main.asyncAfter(deadline: .now() + transitionDuration) {
                currentInstructionText = newText
                withAnimation(.easeInOut(duration: transitionDuration)) {
                    textOpacity = 1.0
                }
            }
        }
        
        // Delay dot animation until text is 80% visible (2.0s after text transition starts)
        let dotAnimationDelay = 2.0 // 1.2s fade out + 0.8s of fade in (80% of 1.2s)
        DispatchQueue.main.asyncAfter(deadline: .now() + dotAnimationDelay) {
            withAnimation(.easeInOut(duration: self.phaseDuration)) {
                self.breathingScale = self.targetBreathingScale
            }
        }
        
        // Track cycle completion - increment when we complete a full cycle (return to breatheIn)
        if newPhase == .breatheIn && hasShownFirstCycle {
            cycleCount += 1
            
            // Check if we've completed the required number of cycles
            let requiredCycles = requiredCyclesForLevel(gameState.currentLevel)
            if cycleCount >= requiredCycles {
                // All required cycles completed, progress to next level
                progressToNextLevel()
                return
            }
        }
        
        // Mark first cycle as shown after the first breatheIn phase
        if newPhase == .hold && !hasShownFirstCycle {
            hasShownFirstCycle = true
        }
    }
    
    private func instructionTextForPhase(_ phase: BreathingPhase) -> String {
        switch phase {
        case .breatheIn:
            return "Breathe In"
        case .hold:
            return "Hold"
        case .breatheOut:
            return "Breathe Out"
        case .holdOut:
            return "Hold"
        }
    }
    
    
    private func startSessionTimer() {
        // No longer using time-based progression
        // Progression now happens in handlePhaseChange when required cycles are completed
        sessionTimer?.invalidate()
        sessionTimer = nil
    }
    
    // Calculate required breathing cycles based on level
    private func requiredCyclesForLevel(_ level: Int) -> Int {
        if level <= 3 {
            return 2  // Levels 1, 2, 3: 2 cycles each
        } else {
            let levelsAfterThree = level - 3
            let additionalCycles = (levelsAfterThree + 1) / 2  // +1 cycle every 2 levels
            return 2 + additionalCycles
        }
    }
    
    private func progressToNextLevel() {
        // Fade to black over 600ms before transitioning to next level
        withAnimation(.easeInOut(duration: 0.6)) {
            self.blackOverlayOpacity = 1.0
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
            self.gameState.nextLevel()
        }
    }
}

// MARK: - Previews

#Preview("Simple Breathing - Level 1") {
    SimpleBreathingView(gameState: {
        let state = GameState()
        state.currentLevel = 1
        return state
    }())
    .preferredColorScheme(.dark)
}

#Preview("Simple Breathing - Level 5") {
    SimpleBreathingView(gameState: {
        let state = GameState()
        state.currentLevel = 5
        return state
    }())
    .preferredColorScheme(.dark)
}
