import { NextRequest, NextResponse } from 'next/server';
import { generateStaticYouTubeData } from '../../../lib/youtubeApi';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Generating static YouTube data for ISR...');
    
    const staticData = await generateStaticYouTubeData();
    
    return NextResponse.json({
      success: true,
      data: staticData,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error generating static YouTube data:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate static YouTube data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Set revalidation period for ISR (24 hours)
export const revalidate = 86400; 